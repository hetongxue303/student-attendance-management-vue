<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { FormInstance, ElMessage, ElNotification } from 'element-plus'
import { useUserStore } from '../store/modules/user'
import { useRoute, useRouter } from 'vue-router'
import { getCaptcha, login } from '../api/auth'
import { decrypt, encrypt } from '../utils/jsencrypt'
import { encryptPasswordToMD5 } from '../hook/encrypt'
import { DURATION_TIME } from '../settings'
import { useCookies } from '@vueuse/integrations/useCookies'

const route = useRoute()
const router = useRouter()
const cookie = useCookies()
const userStore = useUserStore()
const ruleFormRef = ref<FormInstance>()
const loading = ref(false)
const redirect = ref('')
const imgUrl = ref('')
const loginFrom: {
  username: string
  password: string
  code: string
  rememberMe: boolean
} = reactive({
  username: '',
  password: '',
  code: '',
  rememberMe: false
})

enum userinfo {
  username = 'username',
  password = 'password',
  rememberMe = 'rememberMe'
}

const refreshCaptcha = () => {
  getCaptcha().then(({ data }) => (imgUrl.value = data.content))
}
const getCookie = () => {
  loginFrom.username = cookie.get(userinfo.username)
  loginFrom.password = cookie.get(userinfo.password)
    ? decrypt(cookie.get(userinfo.password))
    : ''
  loginFrom.rememberMe = Boolean(cookie.get(userinfo.rememberMe))
}
const handleRememberMe = (status: boolean) => {
  if (status) {
    const expires: Date = new Date(new Date().getTime() + 60 * 60 * 1000)
    cookie.remove(userinfo.username)
    cookie.remove(userinfo.password)
    cookie.remove(userinfo.rememberMe)
    cookie.set(userinfo.username, loginFrom.username, { expires })
    cookie.set(userinfo.password, encrypt(loginFrom.password), { expires })
    cookie.set(userinfo.rememberMe, loginFrom.rememberMe, { expires })
  } else {
    cookie.remove(userinfo.username)
    cookie.remove(userinfo.password)
    cookie.remove(userinfo.rememberMe)
  }
}
const loginHandle = async (formEl?: FormInstance) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      handleRememberMe(loginFrom.rememberMe)
      login({
        username: loginFrom.username,
        password: encryptPasswordToMD5(loginFrom.password),
        code: loginFrom.code,
        rememberMe: loginFrom.rememberMe
      })
        .then(({ data, status }) => {
          if (data.code === 200 && status === 200) {
            userStore.setUserInfo(data)
            ElNotification.success({
              message: '登陆成功',
              duration: DURATION_TIME
            })
            router.push(redirect.value || '/')
          } else {
            loginFrom.code = ''
            refreshCaptcha()
            ElMessage.warning({
              message: data.message || '登陆失败，请重试！',
              duration: DURATION_TIME
            })
          }
        })
        .catch(({ response }) => {
          loginFrom.code = ''
          refreshCaptcha()
          ElMessage.error({
            message: response.data.message,
            duration: DURATION_TIME
          })
        })
        .finally(() => (loading.value = false))
    }
  })
}
watch(
  () => imgUrl.value,
  () => (loginFrom.code = ''),
  { deep: true }
)

watch(
  () => route,
  () => (redirect.value = route.query && (route.query.redirect as string)),
  { deep: true, immediate: true }
)

onMounted(() => {
  refreshCaptcha()
  getCookie()
})
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="left" />
      <div class="right">
        <h2 class="right-title">欢迎回来</h2>
        <div class="right-box">
          <span class="right-box-line" />
          <span>账号密码登录</span>
          <span class="right-box-line" />
        </div>
        <el-form ref="ruleFormRef" :model="loginFrom">
          <el-form-item
            prop="username"
            :rules="{ required: true, message: '请输入账号', trigger: 'blur' }"
          >
            <el-input
              v-model="loginFrom.username"
              prefix-icon="user"
              placeholder="账号"
            />
          </el-form-item>
          <el-form-item
            prop="password"
            :rules="{ required: true, message: '请输入密码', trigger: 'blur' }"
          >
            <el-input
              v-model="loginFrom.password"
              prefix-icon="lock"
              placeholder="密码"
              show-password
              @keyup.enter="loginHandle(ruleFormRef)"
            />
          </el-form-item>
          <el-form-item
            prop="code"
            :rules="{
              required: true,
              message: '请输入验证码',
              trigger: 'blur'
            }"
          >
            <el-row :gutter="10" class="w-250px">
              <el-col :span="14" class="mr-3">
                <el-input
                  v-model="loginFrom.code"
                  size="default"
                  placeholder="验证码"
                  prefix-icon="key"
                  @keyup.enter="loginHandle(ruleFormRef)"
                />
              </el-col>
              <el-col :span="8" class="flex justify-center items-center">
                <el-image
                  :src="imgUrl"
                  :style="{ cursor: 'pointer', marginTop: '3px' }"
                  title="点击切换验证码"
                  @click.stop="refreshCaptcha"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="loginFrom.rememberMe">记住密码</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              @keyup.enter="loginHandle(ruleFormRef)"
              @click="loginHandle(ruleFormRef)"
            >
              <span v-if="loading">登 陆 中...</span>
              <span v-else>登 陆</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(
    to left bottom,
    #e8b7b1,
    #ecbdb3,
    #f0c4b5,
    #f4cab8,
    #f7d1bb,
    #f8cfb9,
    #f9ccb6,
    #facab4,
    #f9beae,
    #f7b2ab,
    #f4a6aa,
    #ee9bac
  );

  .login-box {
    width: 80vw;
    height: 70vh;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    border-radius: 30px;
    display: flex;

    .left {
      height: 100%;
      width: 60%;
      background: radial-gradient(
          ellipse farthest-side at 76% 77%,
          rgba(245, 228, 212, 0.25) 4%,
          rgba(255, 255, 255, 0) calc(4% + 1px)
        ),
        radial-gradient(
          circle at 76% 40%,
          #fef6ec 4%,
          rgba(255, 255, 255, 0) 4.18%
        ),
        linear-gradient(135deg, #ff0000 0%, #000036 100%),
        radial-gradient(
          ellipse at 28% 0%,
          #ffcfac 0%,
          rgba(98, 149, 144, 0.5) 100%
        ),
        linear-gradient(
          180deg,
          #cd6e8a 0%,
          #f5eab0 69%,
          #d6c8a2 70%,
          #a2758d 100%
        );
      background-blend-mode: normal, normal, screen, overlay, normal;
    }

    .right {
      height: 100%;
      width: 40%;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      &-title {
        @apply font-bold text-3xl text-gray-800;
      }

      &-box {
        @apply space-x-2 flex justify-center items-center my-5 text-gray-300;
        &-line {
          @apply h-1px w-16 bg-gray-200;
        }
      }
    }
  }
}

:deep(.el-button) {
  width: 250px;
}
</style>
