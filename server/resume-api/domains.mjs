// Personal-mailbox providers. The résumé is for companies, so an address at
// one of these is turned away and the visitor is asked for a work email.
// Throwaway services are handled separately by disposable_email_blocklist.conf.

export const FREE_DOMAINS = new Set([
  'gmail.com', 'googlemail.com',
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com', 'passport.com',
  'yahoo.com', 'ymail.com', 'rocketmail.com',
  'icloud.com', 'me.com', 'mac.com',
  'aol.com', 'aim.com',
  'proton.me', 'protonmail.com', 'protonmail.ch', 'pm.me',
  'zoho.com', 'zohomail.com', 'zohomail.in',
  'yandex.com', 'yandex.ru', 'ya.ru',
  'mail.com', 'email.com', 'usa.com', 'myself.com', 'consultant.com',
  'gmx.com', 'gmx.net', 'gmx.de', 'web.de',
  'tutanota.com', 'tutanota.de', 'tuta.io', 'tuta.com',
  'fastmail.com', 'fastmail.fm', 'hey.com', 'duck.com',
  'rediffmail.com', 'rediff.com', 'sify.com', 'indiatimes.com',
  'qq.com', '163.com', '126.com', 'sina.com', 'sohu.com', 'aliyun.com',
  'naver.com', 'daum.net', 'hanmail.net',
  'mail.ru', 'inbox.ru', 'list.ru', 'bk.ru', 'rambler.ru',
  'libero.it', 'virgilio.it', 'orange.fr', 'free.fr', 'laposte.net', 'wanadoo.fr',
  't-online.de', 'freenet.de',
  'comcast.net', 'att.net', 'verizon.net', 'sbcglobal.net', 'cox.net', 'charter.net',
  'btinternet.com', 'sky.com', 'virginmedia.com',
  'bigpond.com', 'optusnet.com.au', 'shaw.ca', 'rogers.com',
  'inbox.com', 'hushmail.com', 'lycos.com', 'excite.com', 'juno.com',
])

/* Providers that run the same service under many country domains
   (yahoo.co.in, hotmail.co.uk, outlook.de, …). */
export const FREE_FAMILIES = /^(yahoo|hotmail|outlook|live|gmx|yandex|aol|rediffmail)\./
