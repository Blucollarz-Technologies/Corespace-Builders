import { FloatingWhatsApp } from '@components/FloatingWhatsApp/index'
import { Footer } from '@components/Footer/index'
import { Header } from '@components/Header/index'
import { fetchCostEstimateForm, fetchGlobals } from '@data/index'
import { CostEstimateFormProvider } from '@root/providers/CostEstimateForm/index'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import React from 'react'

export const dynamic = 'force-static'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { isEnabled: draft } = await draftMode()
  const getGlobals = draft
    ? fetchGlobals
    : unstable_cache(fetchGlobals, ['globals', 'mainMenu', 'footer'], {
        tags: ['globals', 'main-menu', 'footer'],
      })
  const getCostEstimateForm = draft
    ? fetchCostEstimateForm
    : unstable_cache(fetchCostEstimateForm, ['cost-estimate-form'], {
        tags: ['globals', 'main-menu', 'forms'],
      })

  const [{ footer, mainMenu, topBar }, costEstimateForm] = await Promise.all([
    getGlobals(),
    getCostEstimateForm(),
  ])

  const menuForm =
    (mainMenu as { costEstimateForm?: typeof costEstimateForm }).costEstimateForm ?? costEstimateForm

  return (
    <CostEstimateFormProvider form={menuForm}>
      <Header {...mainMenu} topBar={topBar} />
      <div>
        {children}
        <Footer {...footer} />
        <FloatingWhatsApp />
      </div>
    </CostEstimateFormProvider>
  )
}
