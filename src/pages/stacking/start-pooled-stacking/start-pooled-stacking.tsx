import { useState } from "react";

import { StacksNetworkName } from "@stacks/network";
import { StackingClient } from "@stacks/stacking";
import { useQuery } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@components/auth-provider/auth-provider";
import { ErrorAlert } from "@components/error-alert";
import { useNetwork } from "@components/network-provider";
import {
  useGetSecondsUntilNextCycleQuery,
  useStackingClient,
} from "@components/stacking-client-provider/stacking-client-provider";

import { StartStackingLayout } from "../components/stacking-layout";
import { ChoosePoolAddress } from "./components/choose-pool-stx-address";
import { ChoosePoolingAmount } from "./components/choose-pooling-amount";
import { ChoosePoolingDuration } from "./components/choose-pooling-duration";
import { ConfirmAndSubmit } from "./components/confirm-and-pool";
import { PoolingInfoCard } from "./components/delegated-stacking-info-card";
import { PooledStackingIntro } from "./components/pooled-stacking-intro";
import { EditingFormValues } from "./types";
import { createHandleSubmit, createValidationSchema } from "./utils";
import { Stack, Box } from "@stacks/ui";
import { StackingFormInfoPanel } from "../components/stacking-form-info-panel";
import { StackingFormContainer } from "../components/stacking-form-container";

const initialDelegatingFormValues: Partial<EditingFormValues> = {
  amount: "",
  poolAddress: "",
  delegationDurationType: undefined,
  numberOfCycles: 1,
};

export function StartPooledStacking() {
  const { client } = useStackingClient();
  const { address } = useAuth();
  const { networkName } = useNetwork();

  if (!address) {
    const msg = "Expected `address` to be defined.";
    console.error(msg);
    return <ErrorAlert>{msg}</ErrorAlert>;
  }
  if (!client) {
    const msg = "Expected `client` to be defined.";
    console.error(msg);
    return <ErrorAlert>{msg}</ErrorAlert>;
  }
  if (!networkName) {
    const msg = "Expected `networkName` to be defined.";
    console.error(msg);
    return <ErrorAlert>{msg}</ErrorAlert>;
  }

  return (
    <StartPooledStackingLayout
      client={client}
      currentAccountAddress={address}
      networkName={networkName}
    />
  );
}

interface StartPooledStackingProps {
  client: StackingClient;
  currentAccountAddress: string;
  networkName: StacksNetworkName;
}
function StartPooledStackingLayout({
  client,
  networkName,
  currentAccountAddress,
}: StartPooledStackingProps) {
  const [isContractCallExtensionPageOpen, setIsContractCallExtensionPageOpen] =
    useState(false);
  const { data, isLoading } = useGetSecondsUntilNextCycleQuery();

  // TODO: move this inside ChoosePoolingAmount, not being used elsewhere
  const queryGetAccountBalance = useQuery(["getAccountBalance", client], () =>
    client.getAccountBalance()
  );
  const navigate = useNavigate();

  const validationSchema = createValidationSchema({
    currentAccountAddress,
    networkName,
  });
  const handleSubmit = createHandleSubmit({
    client,
    navigate,
    setIsContractCallExtensionPageOpen,
  });

  if (isLoading || queryGetAccountBalance.isLoading) return null;
  if (typeof data !== "number") return null;
  if (typeof queryGetAccountBalance.data !== "bigint") return null;

  return (
    <Formik
      initialValues={initialDelegatingFormValues as EditingFormValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <StartStackingLayout
        intro={<PooledStackingIntro timeUntilNextCycle={data} />}
        stackingInfoPanel={
          <StackingFormInfoPanel>
            <PoolingInfoCard />
          </StackingFormInfoPanel>
        }
        stackingForm={
          <>
            <Form>
              <StackingFormContainer>
                <ChoosePoolAddress />
                <ChoosePoolingAmount
                  availableBalance={queryGetAccountBalance.data}
                />
                <ChoosePoolingDuration />
                <ConfirmAndSubmit isLoading={isContractCallExtensionPageOpen} />
              </StackingFormContainer>
            </Form>
          </>
        }
      />
    </Formik>
  );
}
