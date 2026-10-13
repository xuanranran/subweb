window.config = {
  // 网站标题
  siteName: 'Subconverter Web',
  // API 地址
  apiUrl: [
    {
      value: 'http://localhost:25500',
      text: 'localhost 本地版 局域网请修改',
      profile: 'standard',
    },
    {
      value: 'https://api.miaoceo.com',
      text: 'SubConverter-Extended · api.miaoceo.com',
      profile: 'extended',
    },
    {
      value: 'https://sub.miaoceo.com',
      text: 'subconverter · sub.miaoceo.com',
      profile: 'standard',
    },
  ],
  // 短域名服务地址
  shortUrl: 'https://i.miaoceo.com',
  // 首页菜单
  menuItem: [
    {
      title: '首页',
      link: '/',
      target: '',
    },
    {
      title: 'GitHub',
      link: 'https://github.com/xuanranran/subweb',
      target: '_blank',
    },
  ],
  // 远程配置地址
  remoteConfigOptions: [
    {
      value: 'https://raw.githubusercontent.com/xuanranran/Clash/main/Clash/ClashRule_B.ini',
      text: 'LovinYarn Online Clash',
      targets: ['clash', 'clashr'],
    },
    {
      value: 'https://raw.githubusercontent.com/xuanranran/Clash/main/Clash/ClashRule_Stash.ini',
      text: 'LovinYarn Online Stash',
      targets: ['stash'],
    },
    {
      value: 'https://raw.githubusercontent.com/xuanranran/Clash/main/Clash/ClashRule.ini',
      text: 'LovinYarn Online Surge',
      targets: ['surge', 'surfboard'],
    },
    // ACL4SSR Options
    {
      value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online.ini',
      text: 'ACL4SSR Online',
      targets: ['clash', 'clashr'],
    },
    {
      value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full.ini',
      text: 'ACL4SSR Online Full',
      targets: ['clash', 'clashr'],
    },
    {
      value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini.ini',
      text: 'ACL4SSR Online Mini',
      targets: ['clash', 'clashr'],
    },
  ],
};
