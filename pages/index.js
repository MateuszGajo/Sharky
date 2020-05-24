// @ts-nocheck
import I18nProvider from 'next-translate/I18nProvider'
import React from 'react'
import C from '../pages_'
<<<<<<< HEAD
<<<<<<< HEAD
import ns0 from '../public/locales/pl/common.json'
import ns1 from '../public/locales/pl/component.json'
=======
import ns0 from '../public/locales/en/common.json'
import ns1 from '../public/locales/en/component.json'
>>>>>>> features/friends
=======
import ns0 from '../public/locales/pl/common.json'
import ns1 from '../public/locales/pl/component.json'
>>>>>>> features/profile

const namespaces = { 'common': ns0, 'component': ns1 }

export default function Page(p){
  return (
    <I18nProvider 
<<<<<<< HEAD
<<<<<<< HEAD
      lang="pl" 
      namespaces={namespaces}  
      internals={{"isStaticMode":true,"redirectToDefaultLang":false,"defaultLanguage":"pl"}}
=======
      lang="en" 
      namespaces={namespaces}  
      internals={{"isStaticMode":true,"redirectToDefaultLang":false,"defaultLanguage":"en"}}
>>>>>>> features/friends
=======
      lang="pl" 
      namespaces={namespaces}  
      internals={{"isStaticMode":true,"redirectToDefaultLang":false,"defaultLanguage":"pl"}}
>>>>>>> features/profile
    >
      <C {...p} />
    </I18nProvider>
  )
}

Page = Object.assign(Page, { ...C })

if(C && C.getInitialProps) {
<<<<<<< HEAD
<<<<<<< HEAD
  Page.getInitialProps = ctx => C.getInitialProps({ ...ctx, lang: 'pl'})
=======
  Page.getInitialProps = ctx => C.getInitialProps({ ...ctx, lang: 'en'})
>>>>>>> features/friends
=======
  Page.getInitialProps = ctx => C.getInitialProps({ ...ctx, lang: 'pl'})
>>>>>>> features/profile
}





export * from '../pages_'
