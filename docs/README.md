# Documentation

The documentation contained in this folder is separated into [technical](./technical/README.md) and [features](./features/README.md) documentation. The technical documentation contains a description of the most relevant architectural conventions that help us form, maintain and deliver the app's features.

## Language

The technical terms "delegating" and "locking" are presented to the user as "pooling" and "stacking", respectively. This includes all areas where text is visible, such as any text on the page and URL paths.

The code uses "delegating" and "locking" (or related words) wherever a reference to these actions is made, such as variable and file names. When consuming or sending values from/to third party sources, such as APIs or packages, it may make more sense to use the third party names for those values rather than trying to rename them.
