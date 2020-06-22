import appLocaleData from 'react-intl/locale-data/en';
const enMessages = require("../locales/en_US")

const EnLangRtl = {
    messages: {
        ...enMessages
    },
    locale: 'en-US',
    data: appLocaleData
};
export default EnLangRtl;