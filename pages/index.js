// @ts-nocheck
import I18nProvider from 'next-translate/I18nProvider'
import React from 'react'
import C from '../pages_'
import ns0 from '../public/locales/pl/common.json'
import ns1 from '../public/locales/pl/component.json'

const namespaces = { 'common': ns0, 'component': ns1 }

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





export * from '../pages_'
