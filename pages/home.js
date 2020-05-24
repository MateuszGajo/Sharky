// @ts-nocheck
import I18nProvider from 'next-translate/I18nProvider'
import React from 'react'
import C from '../pages_/home'
import ns0 from '../public/locales/pl/common.json'
import ns1 from '../public/locales/pl/component.json'
import ns2 from '../public/locales/pl/home.json'

const namespaces = { 'common': ns0, 'component': ns1, 'home': ns2 }

export default function Page(p){
  return (
    <I18nProvider 
      lang="pl" 
      namespaces={namespaces}  
      internals={{"isStaticMode":true,"redirectToDefaultLang":false,"defaultLanguage":"pl"}}
    >
      <C {...p} />
    </I18nProvider>
  )
}

Page = Object.assign(Page, { ...C })

if(C && C.getInitialProps) {
  Page.getInitialProps = ctx => C.getInitialProps({ ...ctx, lang: 'pl'})
}





export * from '../pages_/home'
