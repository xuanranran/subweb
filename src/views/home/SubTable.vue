<template>
  <div class="row g-4 custom-div">
    <div class="col-12 col-lg-12 pt-4 pt-lg-0">
      <div class="tab-content p-0">
        <div class="tab-pane fade show active">
          <div class="card mb-4">
            <div class="card-body">
              <div class="row mb-3 g-3">
                <div class="col-12 col-md-12">
                  <label class="form-label" for="add-user-email">订阅链接</label>
                  <textarea class="form-control" v-model.trim="urls" :placeholder="placeholder" rows="3"></textarea>
                </div>
                <div class="col-5 col-md-6">
                  <label class="form-label" for="client">客户端</label>
                  <select class="form-select" id="client" v-model="target" @change="selectTarget">
                    <option v-for="option in targetOptions" :key="option" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                </div>
                <div class="col-7 col-md-6">
                  <label class="form-label" for="api">后端服务</label>
                  <select class="form-select" id="api" @change="selectApi">
                    <option value="">请选择后端</option>
                    <option v-for="option in apiUrl" :key="option" :value="option.value">
                      {{ option.text }}
                    </option>
                    <option value="manual">自定义后端 API 地址</option>
                  </select>
                </div>
                <div class="col-12 col-md-12" v-if="isShowManualApiUrl">
                  <input class="form-control" placeholder="自定义后端 API 地址示例：https://suc.miaoco.com" v-model="api" />
                </div>
                <div class="col-8 col-md-10">
                  <label class="form-label" for="remote">远程配置</label>
                  <select class="form-select" id="remote" @change="selectRemoteConfig">
                    <option value="">请选择配置</option>
                    <option v-for="option in remoteConfigOptions" :key="option" :value="option.value">
                      {{ option.text }}
                    </option>
                    <option value="manual">自定义远程配置地址</option>
                  </select>
                </div>
                <div class="col-4 col-md-2">
                  <label class="form-label">&nbsp;</label>
                  <button type="button" class="btn btn-warning" @click="showMoreConfig">参数</button>
                </div>
                <div class="col-12 col-md-12" v-if="isShowRemoteConfig">
                  <input class="form-control" placeholder="自定义远程配置地址：" v-model="remoteConfig" />
                </div>
                <div class="col-12 col-md-12" v-if="isShowMoreConfig">
                  <label class="form-label" for="add-user-email">可选参数</label>
                  <div class="row g-3">
                    <div class="col-12 col-md-12">
                      <input class="form-control" id="filename" placeholder="返回的订阅文件名" v-model="moreConfig.filename" />
                    </div>
                    <div class="col-12 col-md-12">
                      <input class="form-control" placeholder="Include: 包含有关键字的节点, 支持正则" v-model="moreConfig.include" />
                    </div>
                    <div class="col-12 col-md-12">
                      <input class="form-control" placeholder="Exclude: 不包含有关键字的节点, 支持正则" v-model="moreConfig.exclude" />
                    </div>
                    
                    <!-- Advanced Options: Joined Tabs -->
                    <div class="col-12">
                      <div class="joined-tab-group">
                        <button type="button" class="joined-tab-item" :class="{ active: activeTab === 'global' }" @click="toggleTab('global')">
                          <i class="ti ti-settings"></i> 全局字段
                        </button>
                        <button type="button" class="joined-tab-item" :class="{ active: activeTab === 'node' }" @click="toggleTab('node')">
                          <i class="ti ti-server"></i> 节点字段
                        </button>
                        <button type="button" class="joined-tab-item" :class="{ active: activeTab === 'rule' }" @click="toggleTab('rule')">
                          <i class="ti ti-list-check"></i> 规则集
                        </button>
                      </div>

                      <!-- Tab Content: Global -->
                      <div class="tab-content-panel" v-if="activeTab === 'global'">
                        <div class="row g-3">
                           <div class="col-6 col-md-4"><div class="form-check"><input class="form-check-input" type="checkbox" id="emoji" v-model="moreConfig.emoji"><label class="form-check-label" for="emoji">Emoji</label></div></div>
                           <div class="col-6 col-md-4"><div class="form-check"><input class="form-check-input" type="checkbox" id="new_name" v-model="moreConfig.new_name"><label class="form-check-label" for="new_name">Clash New Field</label></div></div>
                           <div class="col-6 col-md-4"><div class="form-check"><input class="form-check-input" type="checkbox" id="nodelist" v-model="moreConfig.list"><label class="form-check-label" for="nodelist">Node List</label></div></div>
                           <div class="col-6 col-md-4"><div class="form-check"><input class="form-check-input" type="checkbox" id="sort" v-model="moreConfig.sort"><label class="form-check-label" for="sort">排序节点</label></div></div>
                           <div class="col-6 col-md-4"><div class="form-check"><input class="form-check-input" type="checkbox" id="append_type" v-model="moreConfig.append_type"><label class="form-check-label" for="append_type">节点类型</label></div></div>
                           <div class="col-6 col-md-4"><div class="form-check"><input class="form-check-input" type="checkbox" id="fdn" v-model="moreConfig.fdn"><label class="form-check-label" for="fdn">过滤非法节点</label></div></div>
                           <div class="col-6 col-md-4"><div class="form-check"><input class="form-check-input" type="checkbox" id="tls13" v-model="moreConfig.tls13"><label class="form-check-label" for="tls13">开启 TLS 1.3</label></div></div>
                           <div class="col-6 col-md-4"><div class="form-check"><input class="form-check-input" type="checkbox" id="insert" v-model="moreConfig.insert"><label class="form-check-label" for="insert">插入默认节点</label></div></div>
                        </div>
                      </div>

                      <!-- Tab Content: Node -->
                      <div class="tab-content-panel" v-if="activeTab === 'node'">
                         <div class="row g-3">
                           <div class="col-6 col-md-4"><div class="form-check"><input class="form-check-input" type="checkbox" id="udp" v-model="moreConfig.udp"><label class="form-check-label" for="udp">启用 UDP</label></div></div>
                           <div class="col-6 col-md-4"><div class="form-check"><input class="form-check-input" type="checkbox" id="xudp" v-model="moreConfig.xudp"><label class="form-check-label" for="xudp">启用 XUDP</label></div></div>
                           <div class="col-6 col-md-4"><div class="form-check"><input class="form-check-input" type="checkbox" id="tfo" v-model="moreConfig.tfo"><label class="form-check-label" for="tfo">TCP Fast Open</label></div></div>
                           <div class="col-6 col-md-4"><div class="form-check"><input class="form-check-input" type="checkbox" id="scv" v-model="moreConfig.scv"><label class="form-check-label" for="scv">关闭证书检查</label></div></div>
                         </div>
                      </div>

                      <!-- Tab Content: Rule -->
                      <div class="tab-content-panel" v-if="activeTab === 'rule'">
                        <div class="row g-3">
                           <div class="col-6 col-md-4"><div class="form-check"><input class="form-check-input" type="checkbox" id="expand" v-model="moreConfig.expand"><label class="form-check-label" for="expand">Expand (展开规则)</label></div></div>
                           <div class="col-6 col-md-4"><div class="form-check"><input class="form-check-input" type="checkbox" id="classic" v-model="moreConfig.classic"><label class="form-check-label" for="classic">Classic Rule-Provider</label></div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-12">
                  <div class="divider divider-dashed">
                    <div class="divider-text"><i class="ti ti-refresh"></i></div>
                  </div>
                </div>
                <div class="col-12 col-md-10">
                  <input class="form-control" placeholder="点击转换链接" v-model.trim="result.subUrl" />
                </div>
                <div class="col-12 col-md-2">
                  <button type="button" class="btn btn-success" @click="getSubUrl()">转换</button>
                </div>
                <div class="col-12 col-md-10">
                  <input class="form-control" placeholder="点击获取短链" v-model.trim="result.shortUrl" />
                </div>
                <div class="col-12 col-md-2">
                  <button type="button" class="btn btn-primary" @click="getShortUrl()">短链</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { showLoading, hideLoading } from '@/components/loading';
import { getSubLink, regexCheck } from './index.js';
import { request } from '@/network';
import showNotification from '@/components/notification';
export default {
  name: 'SubTable',
  setup() {
    const DEFAULT_MORECONFIG = {
      filename: '',
      include: '',
      exclude: '',
      emoji: true,
      udp: true,
      expand: false,
      sort: false,
      scv: false,
      list: false,
      new_name: true,
      fdn: false,
      tls13: false,
      insert: false,
      tfo: false,
      xudp: false,
      append_type: false,
      classic: false,
    };
    return {
      DEFAULT_MORECONFIG,
    };
  },
  data() {
    return {
      placeholder: '多订阅链接或节点请确保每行一条\n支持手动使用"|"分割多链接或节点',
      targetOptions: [
        { value: 'clash', text: 'Clash' },
        { value: 'clashr', text: 'ClashR' },
        { value: 'v2ray', text: 'V2Ray' },
        { value: 'quan', text: 'Quantumult' },
        { value: 'quanx', text: 'Quantumult X' },
        { value: 'surge&ver=2', text: 'SurgeV2' },
        { value: 'surge&ver=3', text: 'SurgeV3' },
        { value: 'surge&ver=4', text: 'SurgeV4' },
        { value: 'surfboard', text: 'Surfboard' },
        { value: 'ss', text: 'SS (SIP002)' },
        { value: 'sssub', text: 'SS Android' },
        { value: 'ssd', text: 'SSD' },
        { value: 'ssr', text: 'SSR' },
        { value: 'loon', text: 'Loon' },
        { value: 'singbox', text: 'Sing-box' },
      ],
      apiUrl: window.config.apiUrl,
      shortUrl: window.config.shortUrl,
      remoteConfigOptions: window.config.remoteConfigOptions,
      moreConfig: this.DEFAULT_MORECONFIG,
      isShowMoreConfig: false,
      isShowManualApiUrl: false,
      isShowRemoteConfig: false,
      result: {
        subUrl: '',
        shortUrl: '',
      },
      urls: [],
      api: window.config.apiUrl,
      target: 'clash',
      remoteConfig: '',
      activeTab: '', // 'global', 'node', 'rule'
    };
  },
  methods: {
    toggleTab(tab) {
      this.activeTab = this.activeTab === tab ? '' : tab;
    },
    showMoreConfig() {
      this.isShowMoreConfig = !this.isShowMoreConfig;
    },
    selectApi(event) {
      if (event.target.value == 'manual') {
        this.api = '';
        this.isShowManualApiUrl = true;
      } else {
        this.isShowManualApiUrl = false;
        this.api = event.target.value;
      }
    },
    selectRemoteConfig(event) {
      if (event.target.value == 'manual') {
        this.remoteConfig = '';
        this.isShowRemoteConfig = true;
      } else {
        this.isShowRemoteConfig = false;
        this.remoteConfig = event.target.value;
      }
    },
    toCopy(url, title) {
      if (!url) {
        this.$showDialog('warning', '注意', '复制失败 内容为空');
        return;
      }
      var copyInput = document.createElement('input');
      copyInput.setAttribute('value', url);
      document.body.appendChild(copyInput);
      copyInput.select();
      try {
        var copyed = document.execCommand('copy');
        if (copyed) {
          document.body.removeChild(copyInput);
          showNotification(title + ' 复制成功', '成功');
        }
      } catch {
        this.$showDialog('warning', '注意', '复制失败，请检查浏览器兼容性');
      }
    },
    getConverter() {
      if (this.urls == '') {
        this.$showDialog('warning', '注意', '请输入订阅链接或节点');
        return false;
      }
      if (!regexCheck(this.api)) {
        this.$showDialog('warning', '注意', '请输入自定义后端 API 地址，或选择默认后端服务。');
        return false;
      }
      if (this.remoteConfig == '' && this.isShowRemoteConfig) {
        this.$showDialog('warning', '注意', '请输入远程配置地址，或选择默认配置。');
        return false;
      }
      if (this.api.endsWith('/')) {
        // 自动删除末尾的斜杠
        this.api = this.api.slice(0, -1);
      }
      this.result.subUrl = getSubLink(
        this.urls,
        this.api,
        this.target,
        this.remoteConfig,
        this.isShowMoreConfig,
        this.moreConfig
      );
      return true;
    },
    getSubUrl() {
      if (!this.getConverter()) {
        return;
      }
      this.toCopy(this.result.subUrl, '订阅链接');
    },
    getShortUrl() {
      if (!this.getConverter()) {
        return;
      }
      let data = new FormData();
      data.append('longUrl', btoa(this.result.subUrl));
      showLoading();
      request({
        method: 'post',
        url: this.shortUrl + '/short',
        header: {
          'Content-Type': 'application/form-data; charset=utf-8',
        },
        data: data,
      })
        .then((res) => {
          if (res.data.Code === 1 && res.data.ShortUrl !== '') {
            this.result.shortUrl = res.data.ShortUrl;
            this.toCopy(this.result.shortUrl, '短链接');
          }
          hideLoading();
        })
        .catch(() => {
          this.$showDialog('error', '失败', '短链接生成失败 请检查短链接服务是否可用');
          hideLoading();
        });
    },
  },
};
</script>

<style scoped>
.custom-div {
  width: 100%;
  margin: 0 auto;
}
@media (min-width: 767.98px) {
  .custom-div {
    width: 90%;
    margin: 0 auto;
  }
}
@media (min-width: 991.98px) {
  .custom-div {
    width: 80%;
    margin: 0 auto;
  }
}
@media (min-width: 1199.98px) {
  .custom-div {
    width: 70%;
    margin: 0 auto;
  }
}

.btn {
  width: 100%;
}

.check-div {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100%; /* 可以设置固定高度或者根据需求调整 */
}

.divider {
  margin: 1%;
}
</style>
