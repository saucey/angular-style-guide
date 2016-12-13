export const defaultOptions = {
  name: 'form_name',
  inputList: [],
  submitButton: {
    serviceUrl: 'https://www.test.aegon.nl/data/thund/thund/dip',
    label: 'Verzenden'
  },
  introText: false,
  middleText: false,
  bottomText: false,
  thankYouMessage: false,
  redirectUrl: false,
  serviceRequest: false,
  serviceCredentials: "CREDENTIAL_HERE",
  serviceErrorMessage : false,
  serviceOkPath: "",
  serviceOkValue: "",
  serviceKoPath: "",
  serviceOkCheckOnlyIfExists : false,
  correlationIdPath: "",
  correlationIdPrefix : "",
  formValidationRequired: "Invullen van dit veld is verplicht."
}