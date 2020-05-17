// @ts-nocheck
import I18nProvider from 'next-translate/I18nProvider'
import React from 'react'
import C from '../pages_/signin'
import ns0 from '../public/locales/en/common.json'
import ns1 from '../public/locales/en/component.json'

const namespaces = { 'common': ns0, 'component': ns1 }

export default function Page(p){
  return (
    <I18nProvider 
      lang="en" 
      namespaces={namespaces}  
      internals={{"isStaticMode":true,"redirectToDefaultLang":false,"defaultLanguage":"en"}}
    >
      <C {...p} />
    </I18nProvider>
  )
}

Page = Object.assign(Page, { ...C })

if(C && C.getInitialProps) {
  Page.getInitialProps = ctx => C.getInitialProps({ ...ctx, lang: 'en'})
}





export * from '../pages_/signin'
