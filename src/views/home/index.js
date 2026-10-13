import { buildConversion, endpoint } from '../../lib/converter.js';

const getSubLink = (urls, api, target, remoteConfig, isShowMoreConfig, moreConfig, profile = 'standard') => {
  const [client, version] = target.split('&ver=');
  return buildConversion({
    backend: api,
    profile,
    target: client,
    ver: version || '',
    sources: urls,
    config: remoteConfig || '',
    options: isShowMoreConfig ? moreConfig : {},
  }).url;
};
const regexCheck = (value) => {
  try {
    endpoint(value);
    return true;
  } catch {
    return false;
  }
};
export { regexCheck, getSubLink };
