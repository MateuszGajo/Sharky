// @ts-nocheck
import I18nProvider from 'next-translate/I18nProvider'
import React from 'react'
import C from '../pages_'
<<<<<<< HEAD
import ns0 from '../public/locales/pl/common.json'
import ns1 from '../public/locales/pl/component.json'
=======
import ns0 from '../public/locales/en/common.json'
import ns1 from '../public/locales/en/component.json'
>>>>>>> features/friends

const namespaces = { 'common': ns0, 'component': ns1 }

export default function Page(p){
  return (
    <I18nProvider 
<<<<<<< HEAD
      lang="pl" 
      namespaces={namespaces}  
      internals={{"isStaticMode":true,"redirectToDefaultLang":false,"defaultLanguage":"pl"}}
=======
      lang="en" 
      namespaces={namespaces}  
      internals={{"isStaticMode":true,"redirectToDefaultLang":false,"defaultLanguage":"en"}}
>>>>>>> features/friends
    >
      <C {...p} />
    </I18nProvider>
  )
}

Page = Object.assign(Page, { ...C })

if(C && C.getInitialProps) {
<<<<<<< HEAD
  Page.getInitialProps = ctx => C.getInitialProps({ ...ctx, lang: 'pl'})
=======
  Page.getInitialProps = ctx => C.getInitialProps({ ...ctx, lang: 'en'})
>>>>>>> features/friends
}





export * from '../pages_'
