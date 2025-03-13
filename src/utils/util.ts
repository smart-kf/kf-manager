import ls from '@/utils/Storage'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

// 清除token 权限，用户信息，菜单信息
export function clearUserInfo() {
  ls.clear()
}

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

// aes encryption key
export const encryptKeys = {
  // key最少4位,否则报错
  key: '1111',
  iv: '1'
}

// url参数转对象
export const getQueryParameters = (options) => {
  const url = options.url
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

export const getBody = (options) => {
  return options.body && JSON.parse(options.body)
}

export function scorePassword(pass) {
  let score = 0
  if (!pass) {
    return score
  }
  // award every unique letter until 5 repetitions
  const letters = {}
  for (let i = 0; i < pass.length; i++) {
    letters[pass[i]] = (letters[pass[i]] || 0) + 1
    score += 5.0 / letters[pass[i]]
  }

  // bonus points for mixing it up
  const variations = {
    digits: /\d/.test(pass),
    lower: /[a-z]/.test(pass),
    upper: /[A-Z]/.test(pass),
    nonWords: /\W/.test(pass)
  }

  let variationCount = 0
  for (const check in variations) {
    variationCount += variations[check] === true ? 1 : 0
  }
  score += (variationCount - 1) * 10

  return parseInt(score + '')
}

export const firstLetterIsUpperCase = function (str) {
  const reg = /^[A-Z][A-z0-9]*$/
  return reg.test(str)
}

export const separator = ';'

export const divisionStringToArray = (string, customSeparator) => {
  return string ? string.split(customSeparator || separator) : []
}

export const getWeek = (week: number, useZhou) => {
  let txt = ''
  switch (week) {
    case 1:
      txt = '一'
      break
    case 2:
      txt = '二'
      break
    case 3:
      txt = '三'
      break
    case 4:
      txt = '四'
      break
    case 5:
      txt = '五'
      break
    case 6:
      txt = '六'
      break
    case 0:
      txt = '日'
      break
    default:
      return 'getWeekError'
  }
  return useZhou ? '周' : '星期' + txt
}
export const baseURL = import.meta.env.VITE_BASE_URL

export function toLocalTimeStr({ date, format = 'YYYY-MM-DD HH:mm:ss' }) {
  if (!date) return null
  return dayjs(date).format(format)
}
// 对象转数组
export function objToArr(obj) {
  const arr: any = []
  for (const o in obj) {
    arr.push({ label: o, txt: obj[o] })
  }
  return arr
}
// 重置对象的每个值
export function clearObj(obj) {
  for (const key in obj) {
    obj[key] = undefined
  }
}
// 删除数组里的值
export function delArrItem(arr, item) {
  const index = arr.indexOf(item)
  arr.splice(index, 1)
}

export const useImageUrl = (name: string, type: string = 'png'): string => {
  /**
   * @method vite动态引入图片
   * @params folder 文件夹名称 name 文件名称 type 文件格式 一般为png/jpg/webp/gif等...
   * @returns 图片
   */
  return new URL(`../assets/images/${name}.${type}`, import.meta.url).href
}

export const batchDispatch = (dispatch, arr) => {
  arr.forEach((item) => {
    dispatch(item)
  })
}

// 创建file formDatas
export const createFormData = (formDatas, file) => {
  const formData = new FormData()
  if (file.length) {
    file.map((item) => {
      formData.append('file', item)
    })
  } else {
    formData.append('file', file)
  }
  for (const item in formDatas) {
    formData.append(item, formDatas[item] || '')
  }
  return formData
}

// 获取两个对象之间的差异不同
export function deepDiffKeys(obj1, obj2) {
  const diffKeys = []

  function deepCompare(o1, o2, key) {
    if (o1 === o2) return
    if (typeof o1 !== 'object' || o1 === null || typeof o2 !== 'object' || o2 === null) {
      diffKeys.push(key)
      return
    }

    for (const k in o1) {
      if (o2[k] === undefined) {
        diffKeys.push(key + '.' + k)
      } else {
        deepCompare(o1[k], o2[k], key + '.' + k)
      }
    }

    for (const k in o2) {
      if (o1[k] === undefined) {
        diffKeys.push(key + '.' + k)
      }
    }
  }

  deepCompare(obj1, obj2, 'root')
  return diffKeys
}

export function mergeCdn(path) {
  const { value } = JSON.parse(localStorage.getItem('cdnDomain'))
  return `${value}${path}`
}


export function showText(str, maxLength = 20) {
  // 将字符串拆分为完整的 Unicode 字符数组
  const chars = Array.from(str);
  
  // 截断并重新拼接为字符串
  return chars.length > maxLength 
    ? chars.slice(0, maxLength).join('') + '...' 
    : str;
}


// URL 匹配正则表达式 (支持大多数常见格式)
const URL_REGEX = /\b(https?:\/\/|www\.|ftp:\/\/|mailto:)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

// 安全转义函数 (防止 XSS)
const escapeHTML = str => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

// URL 高亮转换器
export function highlightURLs(text) {
  // 步骤 1: 转义原始文本
  const escapedText = escapeHTML(text);
  
  // 步骤 2: 匹配并替换 URL
  return escapedText.replace(URL_REGEX, match => {
    // 补全协议前缀
    let url = match;
    if (url.startsWith('www.')) {
      url = 'http://' + url;
    }
    
    // 构建安全链接
    return `<a href="${url}" 
               class="highlighted-url" 
               target="_blank" 
               rel="noopener noreferrer"
             >${match}</a>`;
  });
};