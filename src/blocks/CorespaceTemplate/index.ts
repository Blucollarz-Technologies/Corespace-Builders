import type { Block } from 'payload'

import { blockFields } from '@root/fields/blockFields'

import { CorespaceAboutSection } from './sections/About'
import { CorespaceAreasWeServeSection } from './sections/AreasWeServe'
import { CorespaceClientPerspectiveSection } from './sections/ClientPerspective'
import { CorespaceCoorgPlanningSection } from './sections/CoorgPlanning'
import { CorespaceCorePrinciplesSection } from './sections/CorePrinciples'
import { CorespaceCommonChallengesSection } from './sections/CommonChallenges'
import { CorespaceCostClaritySection } from './sections/CostClarity'
import { CorespaceDefinitionSection } from './sections/Definition'
import { CorespaceDecisionFrameworkSection } from './sections/DecisionFramework'
import { CorespaceDesignProcessSection } from './sections/DesignProcess'
import { CorespaceDirectAnswerSection } from './sections/DirectAnswer'
import { CorespaceExploreMoreSection } from './sections/ExploreMore'
import { CorespaceFaqSection } from './sections/Faq'
import { CorespaceFormSuccessSection } from './sections/FormSuccess'
import { CorespaceFeaturedProjectsSection } from './sections/FeaturedProjects'
import { CorespaceGetStartedSection } from './sections/GetStarted'
import { CorespaceIsThisForYouSection } from './sections/IsThisForYou'
import { CorespaceOurApproachSection } from './sections/OurApproach'
import { CorespaceOurDifferenceSection } from './sections/OurDifference'
import { CorespaceOwnersSection } from './sections/Owners'
import { CorespacePlaceholderSection } from './sections/Placeholder'
import { CorespacePositioningSection } from './sections/Positioning'
import { CorespaceProjectGallerySection } from './sections/ProjectGallery'
import { CorespaceProofOfWorkSection } from './sections/ProofOfWork'
import { CorespaceQuickAnswerSection } from './sections/QuickAnswer'
import { CorespaceRelatedPlanningPagesSection } from './sections/RelatedPlanningPages'
import { CorespaceRenovationCostSection } from './sections/RenovationCost'
import { CorespaceProjectsSection } from './sections/Projects'
import { CorespaceServicesSection } from './sections/Services'
import { CorespaceStartHereSection } from './sections/StartHere'
import { CorespaceStepFormSection } from './sections/StepForm'
import { CorespaceStrategyCheckSection } from './sections/StrategyCheck'
import { CorespaceThankYouClosingSection } from './sections/ThankYouClosing'
import { CorespaceTypicalCostRangesSection } from './sections/TypicalCostRanges'
import { CorespaceWhileYouWaitSection } from './sections/WhileYouWait'
import { CorespaceWhoThisIsForSection } from './sections/WhoThisIsFor'
import { CorespaceWhyCorespaceSection } from './sections/WhyCorespace'

/**
 * Corespace Template — page layout block for Modern Earth Architecture sections.
 * Nested section blocks are added here as each section is designed from screenshots.
 */
export const CorespaceTemplate: Block = {
  slug: 'corespaceTemplate',
  interfaceName: 'CorespaceTemplateBlock',
  labels: {
    plural: 'Corespace Templates',
    singular: 'Corespace Template',
  },
  fields: [
    blockFields({
      name: 'corespaceTemplateFields',
      fields: [
        {
          name: 'sections',
          type: 'blocks',
          labels: {
            plural: 'Sections',
            singular: 'Section',
          },
          admin: {
            description:
              'Add Corespace brand sections in order. New section types appear here as they are built from the brand kit.',
            initCollapsed: false,
          },
          blocks: [
            CorespaceAboutSection,
            CorespaceCorePrinciplesSection,
            CorespaceDefinitionSection,
            CorespaceDirectAnswerSection,
            CorespaceQuickAnswerSection,
            CorespaceRenovationCostSection,
            CorespaceServicesSection,
            CorespaceProjectsSection,
            CorespaceFeaturedProjectsSection,
            CorespaceProofOfWorkSection,
            CorespaceIsThisForYouSection,
            CorespaceOurDifferenceSection,
            CorespaceOwnersSection,
            CorespaceWhoThisIsForSection,
            CorespaceDecisionFrameworkSection,
            CorespaceAreasWeServeSection,
            CorespaceExploreMoreSection,
            CorespaceRelatedPlanningPagesSection,
            CorespaceProjectGallerySection,
            CorespacePositioningSection,
            CorespaceFaqSection,
            CorespaceFormSuccessSection,
            CorespaceCoorgPlanningSection,
            CorespaceWhileYouWaitSection,
            CorespaceWhyCorespaceSection,
            CorespaceThankYouClosingSection,
            CorespaceGetStartedSection,
            CorespaceClientPerspectiveSection,
            CorespaceOurApproachSection,
            CorespaceDesignProcessSection,
            CorespaceCostClaritySection,
            CorespaceTypicalCostRangesSection,
            CorespaceCommonChallengesSection,
            CorespaceStrategyCheckSection,
            CorespaceStartHereSection,
            CorespaceStepFormSection,
            CorespacePlaceholderSection,
          ],
        },
      ],
    }),
  ],
}
