'use client'

import React from 'react'

import classes from './index.module.scss'

export type FrameworkQuestion = {
  id?: null | string
  text: string
}

export type CorespaceDecisionFrameworkProps = {
  blockType?: 'corespaceDecisionFramework'
  calloutEmphasis?: null | string
  calloutPrefix?: null | string
  eyebrow?: null | string
  heading?: null | string
  id?: null | string
  questions?: FrameworkQuestion[] | null
}

const QuestionIcon: React.FC = () => (
  <span aria-hidden className={classes.questionIcon}>
    ?
  </span>
)

export const CorespaceDecisionFramework: React.FC<CorespaceDecisionFrameworkProps> = ({
  calloutEmphasis,
  calloutPrefix,
  eyebrow,
  heading,
  questions,
}) => {
  const hasQuestions = Array.isArray(questions) && questions.length > 0
  const showCallout = Boolean(calloutPrefix || calloutEmphasis)

  if (!heading && !hasQuestions) {
    return null
  }

  return (
    <div className={classes.decisionFramework}>
      <div className={classes.header}>
        {eyebrow && <p className={classes.eyebrow}>{eyebrow}</p>}
        {heading && <h2 className={classes.heading}>{heading}</h2>}
      </div>

      {(hasQuestions || showCallout) && (
        <div className={classes.card}>
          {hasQuestions && (
            <ul className={classes.questions}>
              {questions!.map((question, index) => (
                <li className={classes.questionRow} key={question.id ?? `${question.text}-${index}`}>
                  <QuestionIcon />
                  <p className={classes.questionText}>{question.text}</p>
                </li>
              ))}
            </ul>
          )}

          {showCallout && (
            <div className={classes.callout}>
              <p className={classes.calloutText}>
                {calloutPrefix && <span>{calloutPrefix} </span>}
                {calloutEmphasis && <strong>{calloutEmphasis}</strong>}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
