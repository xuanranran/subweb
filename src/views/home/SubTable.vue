<template>
  <div class="row g-4 custom-div">
    <div class="col-12">
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label" for="sources">订阅链接</label
              ><textarea
                id="sources"
                class="form-control"
                v-model="urls"
                :placeholder="placeholder"
                rows="5"
              ></textarea>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label" for="api">后端服务</label
              ><select class="form-select" id="api" v-model="apiChoice" @change="selectApi">
                <option v-for="option in apiUrl" :key="option.value" :value="option.value">{{ option.text }}</option>
                <option value="manual">自定义后端</option>
              </select>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label" for="client">客户端</label
              ><select class="form-select" id="client" v-model="target">
                <option v-for="option in targetOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
            <template v-if="apiChoice === 'manual'"
              ><div class="col-12 col-md-8">
                <label class="form-label" for="custom-api">API 根地址</label
                ><input id="custom-api" class="form-control" v-model="api" placeholder="https://sub.miaoceo.com" />
              </div>
              <div class="col-12 col-md-4">
                <label class="form-label" for="profile">后端类型</label
                ><select id="profile" class="form-select" v-model="manualProfile">
                  <option value="standard">subconverter</option>
                  <option value="extended">SubConverter-Extended</option>
                </select>
              </div></template
            >
            <div class="col-12 col-md-10">
              <label class="form-label" for="remote">远程配置</label
              ><select class="form-select" id="remote" v-model="configChoice">
                <option value="">使用后端默认配置</option>
                <option v-for="option in remoteConfigOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
                <option value="manual">自定义远程配置 URL</option>
              </select>
            </div>
            <div class="col-12 col-md-2">
              <label class="form-label">&nbsp;</label
              ><button type="button" class="btn btn-warning w-100" @click="isShowMoreConfig = !isShowMoreConfig">
                参数
              </button>
            </div>
            <div class="col-12" v-if="configChoice === 'manual'">
              <input
                aria-label="自定义配置 URL"
                class="form-control"
                placeholder="https://example.com/config.ini"
                v-model="manualConfig"
              />
            </div>
            <div class="col-12" v-if="target === 'surge'">
              <label class="form-label" for="surge-version">Surge 版本</label
              ><select id="surge-version" class="form-select" v-model="ver">
                <option value="">后端默认（{{ surgeDefault }}）</option>
                <option v-for="v in [2, 3, 4, 5]" :key="v" :value="String(v)">Surge {{ v }}</option>
              </select>
            </div>
            <div class="col-12" v-if="isShowMoreConfig">
              <p class="small mb-3">
                留空或“跟随后端”保留后端配置。{{
                  profile === 'extended' ? 'Extended 使用新 Clash 字段；分组与规则请放入远程配置。' : ''
                }}
              </p>
              <div class="row g-3">
                <div class="col-12 col-md-6" v-for="field in fields" :key="field.key">
                  <label class="form-label" :for="'param-' + field.key"
                    >{{ field.label }} <small>{{ field.key }}</small></label
                  ><select
                    v-if="field.kind === 'bool'"
                    :id="'param-' + field.key"
                    class="form-select"
                    v-model="moreConfig[field.key]"
                  >
                    <option value="">跟随后端</option>
                    <option value="true">开启</option>
                    <option value="false">关闭</option></select
                  ><textarea
                    v-else-if="field.multiline"
                    :id="'param-' + field.key"
                    class="form-control"
                    v-model="moreConfig[field.key]"
                    rows="2"
                  ></textarea
                  ><input
                    v-else
                    :id="'param-' + field.key"
                    class="form-control"
                    :type="field.kind === 'secret' ? 'password' : 'text'"
                    v-model="moreConfig[field.key]"
                    placeholder="留空使用后端配置"
                    autocomplete="off"
                  /><small class="d-block mt-1">{{ field.help }}</small>
                </div>
              </div>
              <button class="btn btn-outline-secondary mt-3" @click="resetOptions">恢复默认</button>
            </div>
            <div class="col-12"><hr /></div>
            <div class="col-12 col-md-10">
              <input
                class="form-control"
                aria-label="转换结果"
                placeholder="点击转换生成链接"
                :value="result.subUrl"
                readonly
              />
            </div>
            <div class="col-12 col-md-2">
              <button class="btn btn-success w-100" :disabled="busy" @click="getSubUrl">转换</button>
            </div>
            <div class="col-12 col-md-10">
              <input
                class="form-control"
                aria-label="短链接"
                placeholder="点击获取短链"
                :value="result.shortUrl"
                readonly
              />
            </div>
            <div class="col-12 col-md-2">
              <button class="btn btn-primary w-100" :disabled="busy" @click="getShortUrl">短链</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSubLink, regexCheck } from './index.js';
import { base64 } from '../../lib/converter.js';
import { parametersFor, targetsFor, PROFILES } from '../../lib/backends.js';
import { request } from '@/network';
import showNotification from '@/components/notification';

export default {
  name: 'SubTable',
  data() {
    const apis = window.config.apiUrl;
    const first = apis.find((a) => a.profile === 'extended') || apis[0];
    return {
      apiUrl: apis,
      apiChoice: first.value,
      api: first.value,
      manualProfile: 'standard',
      urls: '',
      target: 'clash',
      ver: '',
      configChoice: '',
      manualConfig: '',
      moreConfig: Object.fromEntries(parametersFor(first.profile || 'standard', 'clash').map((p) => [p.key, ''])),
      isShowMoreConfig: false,
      busy: false,
      result: { subUrl: '', shortUrl: '' },
    };
  },
  computed: {
    profile() {
      return this.apiChoice === 'manual'
        ? this.manualProfile
        : this.apiUrl.find((a) => a.value === this.apiChoice)?.profile || 'standard';
    },
    targetOptions() {
      return targetsFor(this.profile);
    },
    surgeDefault() {
      return PROFILES[this.profile].surgeDefault;
    },
    fields() {
      return parametersFor(this.profile, this.target).filter((p) => p.key !== 'provider_headers');
    },
    remoteConfigOptions() {
      return window.config.remoteConfigOptions.filter((c) => !c.targets || c.targets.includes(this.target));
    },
    remoteConfig() {
      return this.configChoice === 'manual' ? this.manualConfig : this.configChoice;
    },
    placeholder() {
      return (
        '订阅链接或节点，每行一条；也支持 | 分隔\n' +
        (this.profile === 'extended'
          ? 'provider:HK,https://example.com/sub\n支持 Provider 名称、tag、interval 前缀'
          : 'tag:来源名称,https://example.com/sub')
      );
    },
    state() {
      return JSON.stringify([
        this.api,
        this.profile,
        this.urls,
        this.target,
        this.ver,
        this.remoteConfig,
        this.isShowMoreConfig,
        this.moreConfig,
      ]);
    },
  },
  watch: {
    state() {
      this.result = { subUrl: '', shortUrl: '' };
    },
    profile() {
      if (!this.targetOptions.some((t) => t.value === this.target)) this.target = 'clash';
      this.resetOptions();
      this.ver = '';
    },
    target() {
      this.resetOptions();
      this.ver = '';
      if (this.configChoice !== 'manual' && !this.remoteConfigOptions.some((c) => c.value === this.configChoice))
        this.configChoice = '';
    },
  },
  methods: {
    resetOptions() {
      this.moreConfig = Object.fromEntries(this.fields.map((p) => [p.key, '']));
    },
    selectApi() {
      this.api = this.apiChoice === 'manual' ? '' : this.apiChoice;
    },
    async toCopy(value) {
      try {
        await navigator.clipboard.writeText(value);
        return;
      } catch {
        /* fallback for LAN HTTP */
      }
      const area = document.createElement('textarea');
      area.value = value;
      area.style.position = 'fixed';
      area.style.left = '-9999px';
      document.body.append(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      if (!ok) throw new Error('复制失败，请手动复制结果。');
    },
    getConverter() {
      if (!regexCheck(this.api)) throw new Error('请选择后端或输入完整的 API 根地址。');
      if (this.configChoice === 'manual' && !this.manualConfig.trim()) throw new Error('请输入自定义配置 URL。');
      const selectedTarget = this.target + (this.target === 'surge' && this.ver ? '&ver=' + this.ver : '');
      this.result.subUrl = getSubLink(
        this.urls,
        this.api,
        selectedTarget,
        this.remoteConfig,
        this.isShowMoreConfig,
        this.moreConfig,
        this.profile
      );
      return this.result.subUrl;
    },
    async getSubUrl() {
      try {
        const url = this.getConverter();
        await this.toCopy(url);
        showNotification('转换链接已复制');
      } catch (e) {
        showNotification(e.message, '注意', 'warning');
      }
    },
    async getShortUrl() {
      this.busy = true;
      try {
        const url = this.getConverter();
        const data = new FormData();
        data.append('longUrl', base64(url));
        const res = await request({
          method: 'post',
          url: window.config.shortUrl.replace(/\/$/, '') + '/short',
          timeout: 15000,
          data,
        });
        if (this.result.subUrl !== url) return;
        if (res.data.Code !== 1 || !/^https?:\/\//.test(res.data.ShortUrl || ''))
          throw new Error(res.data.Message || '短链服务未返回有效链接。');
        this.result.shortUrl = res.data.ShortUrl;
        await this.toCopy(res.data.ShortUrl);
        showNotification('短链接已复制');
      } catch (e) {
        showNotification(e.message || '短链请求失败', '失败');
      } finally {
        this.busy = false;
      }
    },
  },
};
</script>

<style scoped>
.custom-div {
  width: 100%;
  margin: 0 auto;
}
small {
  font-size: 11px;
  opacity: 0.7;
  line-height: 1.7;
}
@media (min-width: 992px) {
  .custom-div {
    width: 80%;
  }
}
@media (min-width: 1200px) {
  .custom-div {
    width: 70%;
  }
}
</style>
