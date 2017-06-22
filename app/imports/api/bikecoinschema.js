export const CoinSchema = new SimpleSchema({
  'address': {
    type: String,
    label: "Address",
    defaultValue: ''
  },
  'privatekey': {
    type: String,
    label: "Private Key",
    defaultValue: ''
  }
});
