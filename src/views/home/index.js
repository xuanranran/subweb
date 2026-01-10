const getSubLink = function (urls, api, target, remoteConfig, isShowMoreConfig, moreConfig) {
  let linkLst = urls.split('\n');
  let link = linkLst.join('|');
  let finalUrl = api + '/sub?target=' + target + '&url=' + encodeURIComponent(link);
  if (remoteConfig) {
    finalUrl = finalUrl + '&config=' + encodeURIComponent(remoteConfig);
  }
  if (isShowMoreConfig) {
    if (moreConfig.include != '') {
      finalUrl = finalUrl + '&include=' + encodeURIComponent(moreConfig.include);
    }
    if (moreConfig.exclude != '') {
      finalUrl = finalUrl + '&exclude=' + encodeURIComponent(moreConfig.exclude);
    }
    if (moreConfig.list) {
      finalUrl = finalUrl + '&list=true';
    } else {
      finalUrl = finalUrl + '&list=false';
    }
    if (moreConfig.filename) {
      finalUrl = finalUrl + '&filename=' + encodeURIComponent(moreConfig.filename);
    }
    if (moreConfig.expand) {
      finalUrl = finalUrl + '&expand=true';
    } else {
      finalUrl = finalUrl + '&expand=false';
    }
    if (moreConfig.tfo) {
      finalUrl = finalUrl + '&tfo=true';
    } else {
      finalUrl = finalUrl + '&tfo=false';
    }
    if (moreConfig.scv) {
      finalUrl = finalUrl + '&scv=true';
    } else {
      finalUrl = finalUrl + '&scv=false';
    }
    if (moreConfig.fdn) {
      finalUrl = finalUrl + '&fdn=true';
    } else {
      finalUrl = finalUrl + '&fdn=false';
    }
    if (moreConfig.sort) {
      finalUrl = finalUrl + '&sort=true';
    } else {
      finalUrl = finalUrl + '&sort=false';
    }
    if (moreConfig.new_name) {
      finalUrl = finalUrl + '&new_name=true';
    } else {
      finalUrl = finalUrl + '&new_name=false';
    }
    if (moreConfig.insert) {
      finalUrl = finalUrl + '&insert=true';
    } else {
      finalUrl = finalUrl + '&insert=false';
    }
    if (moreConfig.udp) {
      finalUrl = finalUrl + '&udp=true';
    } else {
      finalUrl = finalUrl + '&udp=false';
    }
    if (moreConfig.emoji) {
      finalUrl = finalUrl + '&emoji=true';
    } else {
      finalUrl = finalUrl + '&emoji=false';
    }
    if (moreConfig.xudp) {
      finalUrl = finalUrl + '&xudp=true';
    } else {
      finalUrl = finalUrl + '&xudp=false';
    }
    if (moreConfig.append_type) {
      finalUrl = finalUrl + '&append_type=true';
    } else {
      finalUrl = finalUrl + '&append_type=false';
    }
    if (moreConfig.tls13) {
      finalUrl = finalUrl + '&tls13=true';
    } else {
      finalUrl = finalUrl + '&tls13=false';
    }
    if (moreConfig.classic) {
      finalUrl = finalUrl + '&classic=true';
    } else {
      finalUrl = finalUrl + '&classic=false';
    }
  }
  return finalUrl;
};

const regexCheck = function (url) {
  const reg_url = /https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;
  if (reg_url.test(url)) {
    return true;
  } else {
    return false;
  }
};

export { regexCheck, getSubLink };
