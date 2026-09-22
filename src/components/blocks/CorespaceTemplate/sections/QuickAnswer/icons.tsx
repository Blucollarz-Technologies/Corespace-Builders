import React from 'react'

type IconProps = {
  className?: string
}

export const CheckIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    aria-hidden
    className={className}
    fill="none"
    height="20"
    viewBox="0 0 24 24"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.5 12.25L10 15.75L17.5 8.25"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
)

export const DesignIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    aria-hidden
    className={className}
    fill="none"
    height="20"
    viewBox="0 0 24 24"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" width="14" x="5" y="5" />
    <path
      d="M9 14.5V11.5L12 9L15 11.5V14.5H9Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
    <path d="M10.5 14.5V13H13.5V14.5" stroke="currentColor" strokeWidth="1.6" />
  </svg>
)

export const PlusIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    aria-hidden
    className={className}
    fill="none"
    height="20"
    viewBox="0 0 24 24"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 7V17M7 12H17"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.8"
    />
  </svg>
)

export const TerrainIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    aria-hidden
    className={className}
    fill="none"
    height="20"
    viewBox="0 0 24 24"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 17L8.5 10.5L12 14L16 8.5L20 17H4Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  </svg>
)

export const CostIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    aria-hidden
    className={className}
    fill="none"
    height="20"
    viewBox="0 0 24 24"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 4V20M15.5 8.5C15.5 6.84315 13.9853 5.5 12 5.5C10.0147 5.5 8.5 6.84315 8.5 8.5C8.5 10.1569 10.0147 11.5 12 11.5C13.9853 11.5 15.5 12.8431 15.5 14.5C15.5 16.1569 13.9853 17.5 12 17.5C10.0147 17.5 8.5 16.1569 8.5 14.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  </svg>
)

export const HouseIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    aria-hidden
    className={className}
    fill="none"
    height="20"
    viewBox="0 0 24 24"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.5 18.5V11.5L12 7.5L17.5 11.5V18.5H6.5Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
    <path d="M10 18.5V14H14V18.5" stroke="currentColor" strokeWidth="1.6" />
  </svg>
)

export const quickAnswerIcons = {
  check: CheckIcon,
  cost: CostIcon,
  design: DesignIcon,
  house: HouseIcon,
  plus: PlusIcon,
  terrain: TerrainIcon,
} as const

export type QuickAnswerIconKey = keyof typeof quickAnswerIcons
