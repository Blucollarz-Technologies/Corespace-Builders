'use client'

import type { PaddingProps } from '@components/BlockWrapper/index'

import { BlockWrapper } from '@components/BlockWrapper/index'
import { Gutter } from '@components/Gutter/index'
import React from 'react'

import classes from './index.module.scss'
import { CorespaceAbout } from './sections/About/index'
import { CorespaceAreasWeServe } from './sections/AreasWeServe/index'
import { CorespaceClientPerspective } from './sections/ClientPerspective/index'
import { CorespaceCoorgPlanning } from './sections/CoorgPlanning/index'
import { CorespaceCorePrinciples } from './sections/CorePrinciples/index'
import { CorespaceCommonChallenges } from './sections/CommonChallenges/index'
import { CorespaceCostClarity } from './sections/CostClarity/index'
import { CorespaceDefinition } from './sections/Definition/index'
import { CorespaceDecisionFramework } from './sections/DecisionFramework/index'
import { CorespaceDesignProcess } from './sections/DesignProcess/index'
import { CorespaceDirectAnswer } from './sections/DirectAnswer/index'
import { CorespaceExploreMore } from './sections/ExploreMore/index'
import { CorespaceFaq } from './sections/Faq/index'
import { CorespaceFormSuccess } from './sections/FormSuccess/index'
import { CorespaceFeaturedProjects } from './sections/FeaturedProjects/index'
import { CorespaceGetStarted } from './sections/GetStarted/index'
import { CorespaceIsThisForYou } from './sections/IsThisForYou/index'
import { CorespaceOurApproach } from './sections/OurApproach/index'
import { CorespaceOurDifference } from './sections/OurDifference/index'
import { CorespaceOwners } from './sections/Owners/index'
import { CorespacePlaceholder } from './sections/Placeholder'
import { CorespacePositioning } from './sections/Positioning/index'
import { CorespaceProjectGallery } from './sections/ProjectGallery/index'
import { CorespaceProjects } from './sections/Projects/index'
import { CorespaceProofOfWork } from './sections/ProofOfWork/index'
import { CorespaceQuickAnswer } from './sections/QuickAnswer/index'
import { CorespaceRenovationCost } from './sections/RenovationCost/index'
import { CorespaceRelatedPlanningPages } from './sections/RelatedPlanningPages/index'
import { CorespaceServices } from './sections/Services/index'
import { CorespaceStartHere } from './sections/StartHere/index'
import { CorespaceStepForm } from './sections/StepForm/index'
import { CorespaceStrategyCheck } from './sections/StrategyCheck/index'
import { CorespaceThankYouClosing } from './sections/ThankYouClosing/index'
import { CorespaceTypicalCostRanges } from './sections/TypicalCostRanges/index'
import { CorespaceWhileYouWait } from './sections/WhileYouWait/index'
import { CorespaceWhoThisIsFor } from './sections/WhoThisIsFor/index'
import { CorespaceWhyCorespace } from './sections/WhyCorespace/index'

export type CorespaceSection = {
  blockType?: string
  id?: null | string
  [key: string]: unknown
}

export type CorespaceTemplateProps = {
  blockType?: 'corespaceTemplate'
  corespaceTemplateFields?: {
    sections?: CorespaceSection[] | null
    settings?: {
      background?: 'gradientDown' | 'gradientUp' | 'solid' | 'transparent' | null
      theme?: 'dark' | 'light' | null
    }
  }
  hideBackground?: boolean
  padding?: PaddingProps
}

/**
 * Maps nested Corespace section blockTypes → React components.
 * Add new section renderers here as each screenshot is implemented.
 */
const sectionComponents: Record<string, React.ComponentType<any>> = {
  corespaceAbout: CorespaceAbout,
  corespaceAreasWeServe: CorespaceAreasWeServe,
  corespaceClientPerspective: CorespaceClientPerspective,
  corespaceCommonChallenges: CorespaceCommonChallenges,
  corespaceCostClarity: CorespaceCostClarity,
  corespaceDefinition: CorespaceDefinition,
  corespaceDecisionFramework: CorespaceDecisionFramework,
  corespaceDesignProcess: CorespaceDesignProcess,
  corespaceDirectAnswer: CorespaceDirectAnswer,
  corespaceExploreMore: CorespaceExploreMore,
  corespaceFaq: CorespaceFaq,
  corespaceFormSuccess: CorespaceFormSuccess,
  corespaceCoorgPlanning: CorespaceCoorgPlanning,
  corespaceCorePrinciples: CorespaceCorePrinciples,
  corespaceFeaturedProjects: CorespaceFeaturedProjects,
  corespaceFeaturedProjectsShowcase: CorespaceFeaturedProjects,
  corespaceGetStarted: CorespaceGetStarted,
  corespaceIsThisForYou: CorespaceIsThisForYou,
  corespaceOurApproach: CorespaceOurApproach,
  corespaceOurDifference: CorespaceOurDifference,
  corespaceOwners: CorespaceOwners,
  corespacePlaceholder: CorespacePlaceholder,
  corespacePositioning: CorespacePositioning,
  corespaceProjectGallery: CorespaceProjectGallery,
  corespaceProjects: CorespaceProjects,
  corespaceProofOfWork: CorespaceProofOfWork,
  corespaceQuickAnswer: CorespaceQuickAnswer,
  corespaceRenovationCost: CorespaceRenovationCost,
  corespaceRelatedPlanningPages: CorespaceRelatedPlanningPages,
  corespaceServices: CorespaceServices,
  corespaceStartHere: CorespaceStartHere,
  corespaceStepForm: CorespaceStepForm,
  corespaceStrategyCheck: CorespaceStrategyCheck,
  corespaceWhileYouWait: CorespaceWhileYouWait,
  corespaceWhoThisIsFor: CorespaceWhoThisIsFor,
  corespaceWhyCorespace: CorespaceWhyCorespace,
  corespaceThankYouClosing: CorespaceThankYouClosing,
  corespaceTypicalCostRanges: CorespaceTypicalCostRanges,
}

export const CorespaceTemplate: React.FC<CorespaceTemplateProps> = (props) => {
  const { corespaceTemplateFields, hideBackground, padding } = props
  const settings = {
    background: 'transparent' as const,
    theme: 'light' as const,
    ...corespaceTemplateFields?.settings,
  }
  const sections = corespaceTemplateFields?.sections ?? []

  return (
    <BlockWrapper
      className={classes.template}
      hideBackground={hideBackground}
      padding={{ bottom: 'large', top: 'large', ...padding }}
      settings={settings}
      style={{ background: 'var(--brand-ivory, #f8f4ec)' }}
    >
      <Gutter className={classes.gutter}>
        <div className={classes.stack}>
          {sections.length === 0 ? (
            <div className={classes.empty}>
              <p className={classes.emptyEyebrow}>Corespace Template</p>
              <h2 className={classes.emptyTitle}>Sections will appear here</h2>
              <p className={classes.emptyBody}>
                Add sections in the CMS as they are built from the brand kit. Each section is
                responsive for mobile, tablet, and desktop.
              </p>
            </div>
          ) : (
            sections.map((section, index) => {
              if (!section?.blockType || !(section.blockType in sectionComponents)) {
                return null
              }

              const Section = sectionComponents[section.blockType]

              return (
                <section
                  className={classes.section}
                  data-section={section.blockType}
                  key={section.id ?? `${section.blockType}-${index}`}
                >
                  <Section {...section} />
                </section>
              )
            })
          )}
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
