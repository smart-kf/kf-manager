<template>
  <div class="main">
    <div class="login-title">
      <img src="@/assets/login-logo.png" />
    </div>
    <div class="user-layout-login">
      <a-tabs :activeKey="customActiveKey" centered class="login-tab" @change="handleTabClick">
        <!-- 账户密码登录 -->
        <a-tab-pane key="login" tab="卡密登录">
          <a-form id="formLogin" :model="formData" :rules="loginRules">
            <!-- <a-form-item name="userNum">
              <a-input type="text" placeholder="请输入登录卡密" allowClear :maxlength="150" v-model:value="formData.userNum" />
            </a-form-item>
            <a-form-item name="password">
              <a-input-password placeholder="如有设置密码请输入密码，否则请忽略" allowClear :maxlength="150" v-model:value="formData.password" />
            </a-form-item> -->
            <a-form-item name="agree">
              <a-checkbox-group v-model:value="formData.agree">
                <a-checkbox :value="true"></a-checkbox> <span> 请阅读并同意 </span><a @click="showAgreement">《用户协议&隐私政策》 </a>
              </a-checkbox-group>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" class="login-button" :loading="state.loginBtn" :disabled="state.loginBtn" @click="loginSubmit('login')">登录</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <!-- <a-tab-pane key="renew" tab="卡密续费">
          <a-form id="formLogin" ref="renewFormRef" :model="formData" :rules="renewRules">
            <a-form-item name="userNum">
              <a-input type="text" placeholder="请输入原卡密" allowClear :maxlength="150" v-model:value="formData.userNum" />
            </a-form-item>
            <a-form-item name="newUserNum">
              <a-input type="text" placeholder="请输入新卡卡密" allowClear :maxlength="150" v-model:value="formData.newUserNum" />
            </a-form-item>
            <a-form-item name="password">
              <a-input-password placeholder="如有设置密码请输入密码，否则请忽略" allowClear :maxlength="150" v-model:value="formData.password" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" class="login-button" :loading="state.loginBtn" :disabled="state.loginBtn" @click="loginSubmit('renew')">续费</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane> -->
        <a-tab-pane key="other" tab="快捷入口">
          <div class="other-btn">
            <a-button>卡密状态查询</a-button>
          </div>
          <div class="other-btn">
            <a-button>用户IP查询</a-button>
          </div>
        </a-tab-pane>
      </a-tabs>
      <a-button type="primary" class="login-button" :loading="state.loginBtn" :disabled="state.loginBtn" @click="loginHandle">登录</a-button>
    </div>
    <a-modal v-model:open="state.showAgreementDia" width="80vw" centered title="用户协议&隐私政策">
      <div class="agreement-content">
        <p>用户协议&amp;隐私政策</p>
        <p><br /></p>
        <p>云客服用户注册协议</p>
        <p>一、总则</p>
        <p>1.1 用户应当同意本协议的条款并按照页面上的提示完成全部的注册程序。用户在进行注册程序过程中点击"注册"按钮即表示用户与云客服达成协议，完全接受本协议项下的全部条款。</p>
        <p>1.2 用户注册成功后，云客服将给予每个用户一个用户帐号及相应的密码，该用户帐号和密码由用户负责保管；用户应当对以其用户帐号进行的所有活动和事件负法律责任。</p>
        <p>
          1.3
          用户一经注册云客服帐号，除非子频道要求单独开通权限，用户有权利用该账号使用云客服各个频道的单项服务，当用户使用云客服各单项服务时，用户的使用行为视为其对该单项服务的服务条款以及云客服在该单项服务中发出的各类公告的同意。
        </p>
        <p>1.4 云客服服务协议以及各个频道单项服务条款和公告可由云客服随时更新，且无需另行通知。您在使用相关服务时,应关注并遵守其所适用的相关条款。</p>
        <p>
          您在使用云客服提供的各项服务之前，应仔细阅读本服务协议。如您不同意本服务协议及/或随时对其的修改，您可以主动取消云客服提供的服务；您一旦使用云客服服务，即视为您已了解并完全同意本服务协议各项内容，包括云客服对服务协议随时所做的任何修改，并成为云客服用户。
        </p>
        <p>二、注册信息和隐私保护</p>
        <p>
          2．1
          云客服帐号（即云客服用户ID）的所有权归云客服，用户完成注册申请手续后，获得云客服帐号的使用权。用户应提供及时、详尽及准确的个人资料，并不断更新注册资料，符合及时、详尽准确的要求。所有原始键入的资料将引用为注册资料。如果因注册信息不真实而引起的问题，并对问题发生所带来的后果，云客服不负任何责任。如果因注册信息不真实或更新不及时而引发的相关问题，云客服不负任何责任。
        </p>
        <p>2．2 云客服帐号只限手机号码注册。用户应保证注册时所用的手机号码归本人所有，否则，云客服有权终止您的密码、帐号或服务使用，并将您在本服务内任何内容加以移除并删除。</p>
        <p>2．3 用户不应将其帐号、密码转让、出售或出借予他人使用，若用户授权他人使用帐户，应对被授权人在该帐户下发生所有行为负全部责任。</p>
        <p>2．4 在如下情况下，云客服可能会披露您的信息：</p>
        <p>• &nbsp;（1）事先获得您的授权；</p>
        <p>• &nbsp;（2）您使用共享功能；</p>
        <p>• &nbsp;（3）根据法律、法规、法律程序的要求或政府主管部门的强制性要求；</p>
        <p>• &nbsp;（4）为维护云客服的合法权益，例如查找、预防、处理欺诈或安全方面的问题；</p>
        <p>• &nbsp;（5）符合相关服务条款或使用协议的规定。</p>
        <p>2．5 为更好地向用户提供服务，您同意云客服通过短信等形式向您发送相关商业性服务信息。</p>
        <p>三、使用规则</p>
        <p>3．1 用户在使用云客服服务时，必须遵守中华人民共和国相关法律法规的规定，用户应同意将不会利用本服务进行任何违法或不正当的活动，包括但不限于下列行为∶</p>
        <p>（1）上载、展示、张贴、传播或以其它方式传送含有下列内容之一的信息：</p>
        <p>• &nbsp;1）反对宪法所确定的基本原则的；</p>
        <p>• &nbsp;2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</p>
        <p>• &nbsp;3）损害国家荣誉和利益的；</p>
        <p>• &nbsp;4）煽动民族仇恨、民族歧视、破坏民族团结的；</p>
        <p>• &nbsp;5）破坏国家宗教政策，宣扬邪教和封建迷信的；</p>
        <p>• &nbsp;6）散布谣言，扰乱社会秩序，破坏社会稳定的；</p>
        <p>• &nbsp;7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</p>
        <p>• &nbsp;8）侮辱或者诽谤他人，侵害他人合法权利的；</p>
        <p>• &nbsp;9）含有虚假、有害、胁迫、侵害他人隐私、骚扰、侵害、中伤、粗俗、猥亵、或其它道德上令人反感的内容；</p>
        <p>• &nbsp;10）含有中国法律、法规、规章、条例以及任何具有法律效力之规范所限制或禁止的其它内容的；</p>
        <p>（2）不得为任何非法目的而使用云客服生成系统；</p>
        <p>（3）不利用云客服服务从事以下活动：</p>
        <p>• &nbsp;1) 未经允许，进入计算机信息网络或者使用计算机信息网络资源的；</p>
        <p>• &nbsp;2) 未经允许，对计算机信息网络功能进行删除、修改或者增加的；</p>
        <p>• &nbsp;3) 未经允许，对进入计算机信息网络中存储、处理或者传输的数据和应用程序进行删除、修改或者增加的；</p>
        <p>• &nbsp;4) 故意制作、传播计算机病毒等破坏性程序的；</p>
        <p>• &nbsp;5) 其他危害计算机信息网络安全的行为。</p>
        <p>
          3．2
          用户违反本协议或相关的服务条款的规定，导致或产生的任何第三方主张的任何索赔、要求或损失，包括合理的律师费，您同意赔偿云客服与合作公司、关联公司，并使之免受损害。对此，云客服有权视用户的行为性质，采取包括但不限于删除用户发布信息内容、暂停使用许可、终止服务、限制使用、回收云客服帐号、追究法律责任等措施。对恶意注册云客服帐号或利用云客服帐号进行违法活动、捣乱、骚扰、欺骗其他用户以及其他违反本协议的行为，云客服有权回收其帐号。同时，云客服公司会视司法部门的要求，协助调查
        </p>
        <p>
          3．4
          用户须对自己在使用云客服服务过程中的行为承担法律责任。用户承担法律责任的形式包括但不限于：对受到侵害者进行赔偿，以及在云客服首先承担了因用户行为导致的行政处罚或侵权损害赔偿责任后，用户应给予云客服等额的赔偿。
        </p>
        <p>四、服务内容</p>
        <p>4．1 云客服服务的具体内容由云客服根据实际情况提供。</p>
        <p>
          4．2
          云客服提供的部分服务为收费服务，用户使用收费服务需要向云客服支付一定的费用。对于收费服务，本社区会在用户使用之前给予用户明确的提示，只有用户根据提示确认其愿意支付相关费用，用户才能使用该等收费服务。如用户拒绝支付相关费用，则云客服有权不向用户提供该收费服务
        </p>
        <p>
          4．3
          云客服仅提供二维码相关服务，除此之外与相关服务有关的设备(如个人电脑、手机、及其他与接入互联网或移动网有关的装置)及所需的费用(如为接入互联网而支付的电话费及上网费、为使用移动网而支付的手机费)均应由用户自行负担。
        </p>
        <p>
          4．4
          云客服需要定期或不定期地对提供网络服务的平台或相关的设备进行检修或者维护，如因此类情况而造成网络服务（包括收费网络服务）在合理时间内的中断，云客服无需为此承担任何责任。云客服保留不经事先通知为维修保养、升级或其它目的暂停本服务任何部分的权利。
        </p>
        <p>
          4．5
          用户明确同意其使用云客服服务所存在的风险将完全由其自己承担。用户理解并接受通过云客服服务取得的任何信息资料取决于用户自己，并由其承担系统受损、资料丢失以及其它任何风险。云客服对在本服务内得到的任何商品购物服务、交易进程、招聘信息，都不作担保。
        </p>
        <p>4．6 &nbsp;6个月未登录并且帐号自注册起没有使用任何二维码服务的帐号，云客服保留关闭的权利。</p>
        <p>4．7 云客服有权于任何时间暂时或永久修改或终止本服务（或其任何部分），而无论其通知与否，云客服对用户和任何第三人均无需承担任何责任。</p>
        <p>4．8 终止服务</p>
        <p>
          您同意云客服在您违反本服务协议的文字及精神的前提下，终止您的密码、帐号或本服务之使用（或服务之任何部分）。您同意依本服务协议任何规定提供之本服务，无需进行事先通知即可中断或终止。此外，您同意若本服务之使用被中断或终止或您的帐号及相关信息和文件被关闭或删除，云客服对您或任何第三人均不承担任何责任。
        </p>
        <p>五、服务承诺</p>
        <p>5．1 云客服提供的部分服务属于电子公告牌服务。云客服不会对您在本服务生成的不违反本协议的任何内容进行移除和删除。</p>
        <p>六、特别注意事项</p>
        <p>如果您不是具备完全民事权利能力和完全民事行为能力的自然人，您将无权使用云客服服务。</p>
        <p>七、其他</p>
        <p>7．1 本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。</p>
        <p>7．2 如双方就本协议内容或其执行发生任何争议，双方应尽量友好协商解决；协商不成时，任何一方均可向重庆小白龙网络科技有限公司所在地的人民法院提起诉讼。</p>
        <p>7．3 云客服未行使或执行本服务协议任何权利或规定，不构成对前述权利或权利之放弃。</p>
        <p>7．4 如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。</p>
      </div>
      <template #footer>
        <a-button key="submit" type="primary" @click="state.showAgreementDia = false">知道了</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup name="Login">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UserApi } from '@/webapi/index'
import type { Rule } from 'ant-design-vue/es/form'
import ls from '@/utils/Storage'

const router = useRouter()

const state = reactive({
  time: 60,
  loginBtn: false,
  loginType: 0,
  smsSendBtn: false,
  showAgreementDia: false
})
const loginFormRef: any = ref(null)
const renewFormRef: any = ref(null)

// 表单信息
const formData: any = reactive({
  userNum: '', // 卡密
  password: '',
  newUserNum: '', // 续费卡号
  agree: [] // 是否统同意协议
})

// 页签
const customActiveKey = ref<string>('login')

// 表单校验
const loginRules: Record<string, Rule[]> = {
  userNum: [{ required: true, message: '请输入登录卡密' }],
  agree: [{ required: true, message: '请勾选协议', trigger: 'change' }]
}

// 表单校验
const renewRules: Record<string, Rule[]> = {
  userNum: [{ required: true, message: '请输入原卡卡密' }],
  newUserNum: [{ required: true, message: '请输入新卡卡密' }]
}

const handleTabClick = (key: string) => {
  customActiveKey.value = key
  loginFormRef.value && loginFormRef.value.clearValidate()
  renewFormRef.value && renewFormRef.value.clearValidate()
  formData.newUserNum = ''
  formData.password = ''
  formData.agree = []
}

// 打开协议弹窗
const showAgreement = () => {
  state.showAgreementDia = true
}
const loginHandle = async () => {
  ls.set('token', 'xxx')
  router.push({ path: '/qrCode' })
}
const loginSubmit = (type: string) => {
  if (type === 'login') {
    loginFormRef.value
      .validate()
      .then(() => {
        loginHandle()
      })
      .catch((err) => {
        console.log(err)
      })
  } else {
    renewFormRef.value
      .validate()
      .then(() => {
        console.log(formData)
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

// 初始化信息
const initData = () => {
  // getCaptchaId()
}
const getCaptchaId = async () => {
  let res = await UserApi.getCaptchaId()
  console.log(res)
}

onMounted(() => {
  initData()
})
</script>

<style lang="less" scoped>
@import '@/style/index.less';
.main {
  position: relative;
}
.login-title {
  position: absolute;
  top: -40px;
  padding: 3px;
  border-radius: 50%;
  background-color: #fff;
  left: 50%;
  transform: translateX(-50%);
  img {
    width: 86px;
    height: 86px;
  }
}
.user-layout-login {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 2px 11px 1px #cbbdf075;
  min-width: 260px;
  min-height: 374px;
  width: 460px;
  margin: 0 auto;

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
}
.login-tab {
  :deep(.ant-tabs-nav-list) {
    width: 100%;
    .ant-tabs-tab {
      margin: 0;
      justify-content: center;
      width: 33.33%;
    }
  }
}
.other-btn {
  padding-bottom: 12px;
  button {
    width: 100%;
  }
}
.agreement-content {
  height: 60vh;
  overflow-y: auto;
  p {
    margin: 0;
  }
}
</style>
