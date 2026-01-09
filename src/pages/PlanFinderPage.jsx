import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const questions = [
  {
    id: 'users',
    question: 'How many users does your organization have?',
    options: [
      { value: '1-10', label: '1-10 users', points: { basic: 1, standard: 1, premium: 1 } },
      { value: '11-50', label: '11-50 users', points: { basic: 1, standard: 2, premium: 2 } },
      { value: '51-150', label: '51-150 users', points: { basic: 1, standard: 2, premium: 3 } },
      { value: '151-300', label: '151-300 users', points: { basic: 1, standard: 2, premium: 3 } },
      { value: '300+', label: 'More than 300 users', points: { basic: 0, standard: 0, premium: 0, enterprise: 5 } }
    ]
  },
  {
    id: 'desktop',
    question: 'Do you need desktop versions of Word, Excel, and PowerPoint?',
    description: 'Desktop apps work offline and have more advanced features than web versions.',
    options: [
      { value: 'yes', label: 'Yes, we need full desktop applications', points: { basic: 0, standard: 3, premium: 3 } },
      { value: 'web', label: 'No, web and mobile apps are sufficient', points: { basic: 3, standard: 1, premium: 1 } },
      { value: 'some', label: 'Some users need desktop, others just web', points: { basic: 1, standard: 2, premium: 2 } }
    ]
  },
  {
    id: 'security',
    question: 'What are your security and compliance requirements?',
    description: 'Consider industry regulations, data sensitivity, and IT policies.',
    options: [
      { value: 'basic', label: 'Basic security (email filtering, MFA)', points: { basic: 3, standard: 2, premium: 1 } },
      { value: 'moderate', label: 'Moderate (need some data protection features)', points: { basic: 1, standard: 3, premium: 2 } },
      { value: 'advanced', label: 'Advanced (compliance requirements, sensitive data)', points: { basic: 0, standard: 1, premium: 4 } },
      { value: 'regulated', label: 'Heavily regulated industry (healthcare, finance, legal)', points: { basic: 0, standard: 0, premium: 5 } }
    ]
  },
  {
    id: 'devices',
    question: 'How do employees access company resources?',
    description: 'Consider company-owned vs. personal devices (BYOD).',
    options: [
      { value: 'company', label: 'Primarily company-owned devices', points: { basic: 2, standard: 2, premium: 2 } },
      { value: 'byod', label: 'Mix of company and personal devices (BYOD)', points: { basic: 0, standard: 1, premium: 4 } },
      { value: 'mobile', label: 'Mostly mobile devices and shared computers', points: { basic: 3, standard: 2, premium: 2 } },
      { value: 'remote', label: 'Fully remote workforce with various devices', points: { basic: 1, standard: 2, premium: 3 } }
    ]
  },
  {
    id: 'collaboration',
    question: 'What collaboration features are most important?',
    options: [
      { value: 'email', label: 'Email and basic file sharing', points: { basic: 3, standard: 2, premium: 1 } },
      { value: 'teams', label: 'Teams chat, video calls, and document collaboration', points: { basic: 2, standard: 3, premium: 2 } },
      { value: 'webinars', label: 'Webinars and external presentations', points: { basic: 0, standard: 4, premium: 3 } },
      { value: 'advanced', label: 'Advanced project management and workflows', points: { basic: 0, standard: 2, premium: 3 } }
    ]
  },
  {
    id: 'budget',
    question: 'What is your approximate budget per user, per month?',
    options: [
      { value: 'low', label: 'Under $8/user/month', points: { basic: 4, standard: 0, premium: 0 } },
      { value: 'medium', label: '$8-15/user/month', points: { basic: 2, standard: 4, premium: 1 } },
      { value: 'higher', label: '$15-25/user/month', points: { basic: 1, standard: 2, premium: 4 } },
      { value: 'flexible', label: 'Flexible - value matters more than cost', points: { basic: 1, standard: 2, premium: 3 } }
    ]
  },
  {
    id: 'specific',
    question: 'Do you need any of these specific features?',
    description: 'Select all that apply to your organization.',
    multiSelect: true,
    options: [
      { value: 'access', label: 'Microsoft Access database', points: { basic: 0, standard: 2, premium: 2 } },
      { value: 'intune', label: 'Device management (Intune)', points: { basic: 0, standard: 0, premium: 3 } },
      { value: 'defender', label: 'Advanced threat protection', points: { basic: 0, standard: 0, premium: 3 } },
      { value: 'windows', label: 'Windows 11 Pro upgrade rights', points: { basic: 0, standard: 0, premium: 2 } },
      { value: 'dlp', label: 'Data loss prevention', points: { basic: 0, standard: 0, premium: 3 } },
      { value: 'none', label: 'None of these', points: { basic: 1, standard: 1, premium: 0 } }
    ]
  }
]

const planDetails = {
  basic: {
    name: 'Microsoft 365 Business Basic',
    price: '$6.00/user/month',
    color: '#10b981',
    description: 'Perfect for organizations that primarily use web-based tools and need essential cloud productivity.',
    highlights: [
      'Web and mobile Office apps',
      'Business email with 50GB mailbox',
      'Microsoft Teams',
      '1TB OneDrive storage',
      'SharePoint team sites'
    ]
  },
  standard: {
    name: 'Microsoft 365 Business Standard',
    price: '$12.50/user/month',
    color: '#3b82f6',
    description: 'The most popular choice for growing businesses that need full desktop applications and collaboration tools.',
    highlights: [
      'Everything in Basic, plus:',
      'Desktop Word, Excel, PowerPoint, Outlook',
      'Microsoft Access & Publisher',
      'Webinar hosting',
      'Clipchamp video editing'
    ]
  },
  premium: {
    name: 'Microsoft 365 Business Premium',
    price: '$22.00/user/month',
    color: '#8b5cf6',
    description: 'The complete solution for security-conscious organizations that need advanced protection and device management.',
    highlights: [
      'Everything in Standard, plus:',
      'Microsoft Intune device management',
      'Defender for Office 365',
      'Azure Information Protection',
      'Windows 11 Pro upgrade rights'
    ]
  },
  enterprise: {
    name: 'Microsoft 365 Enterprise',
    price: 'Starting at $36.00/user/month',
    color: '#f59e0b',
    description: 'For organizations with 300+ users or those requiring advanced compliance, analytics, and unlimited scalability.',
    highlights: [
      'Unlimited users',
      'Advanced eDiscovery',
      'Data loss prevention',
      'Power BI Pro (E5)',
      'Phone System (E5)'
    ]
  }
}

function PlanFinderPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [scores, setScores] = useState({ basic: 0, standard: 0, premium: 0, enterprise: 0 })
  const [showResults, setShowResults] = useState(false)
  const [selectedMulti, setSelectedMulti] = useState([])

  const question = questions[currentQuestion]
  const progress = ((currentQuestion) / questions.length) * 100

  const handleAnswer = (option) => {
    if (question.multiSelect) {
      if (option.value === 'none') {
        setSelectedMulti(['none'])
      } else {
        const newSelected = selectedMulti.filter(v => v !== 'none')
        if (newSelected.includes(option.value)) {
          setSelectedMulti(newSelected.filter(v => v !== option.value))
        } else {
          setSelectedMulti([...newSelected, option.value])
        }
      }
    } else {
      // Single select - proceed immediately
      const newScores = { ...scores }
      Object.keys(option.points).forEach(plan => {
        newScores[plan] = (newScores[plan] || 0) + option.points[plan]
      })
      setScores(newScores)
      setAnswers({ ...answers, [question.id]: option.value })

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        setShowResults(true)
      }
    }
  }

  const handleMultiSubmit = () => {
    const newScores = { ...scores }
    selectedMulti.forEach(value => {
      const option = question.options.find(o => o.value === value)
      if (option) {
        Object.keys(option.points).forEach(plan => {
          newScores[plan] = (newScores[plan] || 0) + option.points[plan]
        })
      }
    })
    setScores(newScores)
    setAnswers({ ...answers, [question.id]: selectedMulti })
    setSelectedMulti([])

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const getRecommendation = () => {
    // If enterprise was specifically triggered
    if (scores.enterprise >= 5) {
      return 'enterprise'
    }

    const planScores = [
      { plan: 'basic', score: scores.basic },
      { plan: 'standard', score: scores.standard },
      { plan: 'premium', score: scores.premium }
    ]

    planScores.sort((a, b) => b.score - a.score)
    return planScores[0].plan
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setScores({ basic: 0, standard: 0, premium: 0, enterprise: 0 })
    setShowResults(false)
    setSelectedMulti([])
  }

  const recommendation = getRecommendation()
  const recommendedPlan = planDetails[recommendation]

  // Calculate all scores for comparison
  const allScores = [
    { plan: 'basic', ...planDetails.basic, score: scores.basic },
    { plan: 'standard', ...planDetails.standard, score: scores.standard },
    { plan: 'premium', ...planDetails.premium, score: scores.premium }
  ].sort((a, b) => b.score - a.score)

  const maxScore = Math.max(scores.basic, scores.standard, scores.premium)

  return (
    <div>
      <SEO
        title="Microsoft 365 Plan Finder - Which Plan Do I Need?"
        path="/plan-finder"
        description="Answer a few questions to find the perfect Microsoft 365 plan for your organization. Our free assessment tool helps you choose between Business Basic, Standard, and Premium."
      />
      <Header />

      <section className="hero" style={{ padding: '50px 20px' }}>
        <div className="container">
          <h1>Microsoft 365 Plan Finder</h1>
          <p>Answer a few quick questions to find the perfect plan for your organization</p>
        </div>
      </section>

      <section className="content-section" style={{ minHeight: '500px' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          {!showResults ? (
            <>
              {/* Progress bar */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', color: '#666' }}>
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
                <div style={{ background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      height: '100%',
                      width: `${progress}%`,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>

              {/* Question */}
              <div style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{question.question}</h2>
                {question.description && (
                  <p style={{ color: '#666', fontSize: '0.95rem' }}>{question.description}</p>
                )}
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {question.options.map((option, index) => {
                  const isSelected = question.multiSelect
                    ? selectedMulti.includes(option.value)
                    : answers[question.id] === option.value

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      style={{
                        padding: '20px 25px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #667eea' : '2px solid #e5e7eb',
                        background: isSelected ? '#f0f4ff' : 'white',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '1rem',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                      }}
                    >
                      {question.multiSelect && (
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          border: isSelected ? '2px solid #667eea' : '2px solid #d1d5db',
                          background: isSelected ? '#667eea' : 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {isSelected && <span style={{ color: 'white', fontWeight: 'bold' }}>✓</span>}
                        </div>
                      )}
                      <span>{option.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Multi-select submit button */}
              {question.multiSelect && (
                <button
                  onClick={handleMultiSubmit}
                  disabled={selectedMulti.length === 0}
                  style={{
                    marginTop: '25px',
                    padding: '15px 40px',
                    borderRadius: '10px',
                    border: 'none',
                    background: selectedMulti.length === 0 ? '#d1d5db' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: selectedMulti.length === 0 ? 'not-allowed' : 'pointer',
                    width: '100%'
                  }}
                >
                  Continue
                </button>
              )}

              {/* Back button */}
              {currentQuestion > 0 && (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  style={{
                    marginTop: '15px',
                    padding: '10px',
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  ← Back to previous question
                </button>
              )}
            </>
          ) : (
            /* Results */
            <div>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: recommendedPlan.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '2rem'
                }}>
                  ✓
                </div>
                <h2 style={{ marginBottom: '10px' }}>Your Recommended Plan</h2>
                <p style={{ color: '#666' }}>Based on your answers, we recommend:</p>
              </div>

              {/* Recommended plan card */}
              <div style={{
                background: `linear-gradient(135deg, ${recommendedPlan.color}15 0%, ${recommendedPlan.color}05 100%)`,
                border: `2px solid ${recommendedPlan.color}`,
                borderRadius: '16px',
                padding: '30px',
                marginBottom: '30px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ margin: 0, color: recommendedPlan.color, fontSize: '1.4rem' }}>{recommendedPlan.name}</h3>
                    <p style={{ margin: '5px 0 0', fontSize: '1.2rem', fontWeight: 'bold' }}>{recommendedPlan.price}</p>
                  </div>
                  <div style={{
                    background: recommendedPlan.color,
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                  }}>
                    Best Match
                  </div>
                </div>
                <p style={{ color: '#444', lineHeight: '1.6', marginBottom: '20px' }}>{recommendedPlan.description}</p>
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '0.95rem' }}>Key Features:</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                    {recommendedPlan.highlights.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Score comparison */}
              {recommendation !== 'enterprise' && (
                <div style={{ marginBottom: '40px' }}>
                  <h3 style={{ marginBottom: '20px' }}>How All Plans Scored</h3>
                  {allScores.map((plan, index) => (
                    <div key={plan.plan} style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontWeight: index === 0 ? 'bold' : 'normal' }}>{plan.name}</span>
                        <span style={{ color: '#666' }}>{plan.price}</span>
                      </div>
                      <div style={{ background: '#e5e7eb', borderRadius: '6px', height: '12px', overflow: 'hidden' }}>
                        <div
                          style={{
                            background: plan.color,
                            height: '100%',
                            width: `${(plan.score / maxScore) * 100}%`,
                            borderRadius: '6px'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link
                  to="/licensing-guides"
                  className="submit-btn"
                  style={{ textDecoration: 'none', padding: '15px 30px' }}
                >
                  Learn More About Plans
                </Link>
                <Link
                  to="/"
                  className="submit-btn"
                  style={{
                    textDecoration: 'none',
                    padding: '15px 30px',
                    background: 'transparent',
                    border: '2px solid #667eea',
                    color: '#667eea'
                  }}
                >
                  Enter Free Giveaway
                </Link>
              </div>

              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button
                  onClick={resetQuiz}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Retake Assessment
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Info section */}
      <section className="content-section" style={{ background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Why Use This Tool?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🎯</div>
              <h3 style={{ marginBottom: '10px' }}>Personalized Recommendation</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Our assessment considers your specific needs, budget, security requirements, and team size.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>💰</div>
              <h3 style={{ marginBottom: '10px' }}>Avoid Overpaying</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Don't pay for features you don't need. Find the plan that gives you the best value.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🔒</div>
              <h3 style={{ marginBottom: '10px' }}>Right Security Level</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Ensure you have the security and compliance features your industry requires.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default PlanFinderPage
