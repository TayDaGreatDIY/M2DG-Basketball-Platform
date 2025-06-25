import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const TherapistRegistrationPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Professional Information
    title: '',
    licenseNumber: '',
    licenseState: '',
    licenseExpiration: '',
    specialties: [],
    yearsExperience: '',
    education: '',
    
    // Practice Information
    practiceType: '', // private, group, clinic, hospital
    practiceAddress: '',
    officePhone: '',
    emergencyContact: '',
    
    // Services & Rates
    sessionRate: '',
    acceptsInsurance: false,
    insuranceProviders: [],
    sessionTypes: [], // individual, group, family
    availableHours: '',
    
    // Documents
    license: null,
    degree: null,
    certification: null,
    liability: null,
    
    // About
    bio: '',
    approach: '',
    sportsExperience: false,
    basketballExperience: ''
  });

  const [uploadProgress, setUploadProgress] = useState({});

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const specialtyOptions = [
    'Sports Psychology',
    'Performance Anxiety',
    'Team Dynamics',
    'Goal Setting',
    'Stress Management',
    'Depression',
    'Anxiety Disorders',
    'ADHD',
    'Trauma Therapy',
    'Cognitive Behavioral Therapy',
    'Mindfulness',
    'Substance Abuse',
    'Family Therapy',
    'Group Therapy',
    'Career Counseling'
  ];

  const insuranceProviders = [
    'Aetna', 'Anthem', 'Blue Cross Blue Shield', 'Cigna', 'Humana',
    'Kaiser Permanente', 'Medicaid', 'Medicare', 'UnitedHealth',
    'Tricare', 'EAP Programs', 'Out of Network'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleFileUpload = async (field, file) => {
    if (!file) return;

    // Simulate upload progress
    setUploadProgress(prev => ({ ...prev, [field]: 0 }));
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = (prev[field] || 0) + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return { ...prev, [field]: 100 };
        }
        return { ...prev, [field]: newProgress };
      });
    }, 200);

    // Store file in form data
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formDataObj = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'specialties' || key === 'insuranceProviders' || key === 'sessionTypes') {
          formDataObj.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] instanceof File) {
          formDataObj.append(key, formData[key]);
        } else {
          formDataObj.append(key, formData[key]);
        }
      });

      await api.registerTherapist(formDataObj);
      
      // Success
      navigate('/therapist-registration-success');
    } catch (error) {
      console.error('Failed to register therapist:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">👨‍⚕️ Therapist Registration</h1>
          <p className="text-gray-300">Join our platform to help basketball players achieve mental wellness</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Step {currentStep} of 5</span>
            <span className="text-purple-300">{Math.round((currentStep / 5) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professional Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Professional Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Professional Title *</label>
                  <select
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Title</option>
                    <option value="Licensed Clinical Psychologist">Licensed Clinical Psychologist</option>
                    <option value="Licensed Professional Counselor">Licensed Professional Counselor</option>
                    <option value="Licensed Marriage & Family Therapist">Licensed Marriage & Family Therapist</option>
                    <option value="Licensed Clinical Social Worker">Licensed Clinical Social Worker</option>
                    <option value="Psychiatrist">Psychiatrist</option>
                    <option value="Licensed Mental Health Counselor">Licensed Mental Health Counselor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">License Number *</label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">License State *</label>
                  <select
                    value={formData.licenseState}
                    onChange={(e) => handleInputChange('licenseState', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">License Expiration *</label>
                  <input
                    type="date"
                    value={formData.licenseExpiration}
                    onChange={(e) => handleInputChange('licenseExpiration', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Years of Experience *</label>
                  <input
                    type="number"
                    value={formData.yearsExperience}
                    onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Education *</label>
                  <input
                    type="text"
                    value={formData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    placeholder="e.g., PhD in Psychology - UCLA"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Specialties (Select all that apply)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {specialtyOptions.map(specialty => (
                    <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.specialties.includes(specialty)}
                        onChange={() => handleMultiSelect('specialties', specialty)}
                        className="rounded text-purple-500 focus:ring-purple-500"
                      />
                      <span className="text-gray-300 text-sm">{specialty}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Practice Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Practice Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Practice Type *</label>
                  <select
                    value={formData.practiceType}
                    onChange={(e) => handleInputChange('practiceType', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Practice Type</option>
                    <option value="private">Private Practice</option>
                    <option value="group">Group Practice</option>
                    <option value="clinic">Clinic</option>
                    <option value="hospital">Hospital</option>
                    <option value="telehealth">Telehealth Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Session Rate (USD) *</label>
                  <input
                    type="number"
                    value={formData.sessionRate}
                    onChange={(e) => handleInputChange('sessionRate', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="150"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Practice Address</label>
                <textarea
                  value={formData.practiceAddress}
                  onChange={(e) => handleInputChange('practiceAddress', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="Full practice address (if applicable)"
                />
              </div>

              {/* Insurance */}
              <div>
                <label className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    checked={formData.acceptsInsurance}
                    onChange={(e) => handleInputChange('acceptsInsurance', e.target.checked)}
                    className="rounded text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-white font-medium">I accept insurance</span>
                </label>

                {formData.acceptsInsurance && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {insuranceProviders.map(provider => (
                      <label key={provider} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.insuranceProviders.includes(provider)}
                          onChange={() => handleMultiSelect('insuranceProviders', provider)}
                          className="rounded text-purple-500 focus:ring-purple-500"
                        />
                        <span className="text-gray-300 text-sm">{provider}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Document Upload */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Required Documents</h2>
              <p className="text-gray-300 mb-6">Please upload the following documents for verification:</p>

              {/* Document Upload Cards */}
              {[
                { key: 'license', title: 'Professional License', required: true, description: 'Current state license certificate' },
                { key: 'degree', title: 'Degree Certificate', required: true, description: 'Master\'s or Doctoral degree in relevant field' },
                { key: 'certification', title: 'Additional Certifications', required: false, description: 'Any relevant certifications or training' },
                { key: 'liability', title: 'Liability Insurance', required: true, description: 'Proof of professional liability insurance' }
              ].map(doc => (
                <div key={doc.key} className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-bold">
                        {doc.title} {doc.required && <span className="text-red-400">*</span>}
                      </h3>
                      <p className="text-gray-400 text-sm">{doc.description}</p>
                    </div>
                    {formData[doc.key] && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓ Uploaded</span>
                    )}
                  </div>

                  {uploadProgress[doc.key] !== undefined && uploadProgress[doc.key] < 100 && (
                    <div className="mb-4">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress[doc.key]}%` }}
                        ></div>
                      </div>
                      <p className="text-purple-300 text-sm mt-1">Uploading... {uploadProgress[doc.key]}%</p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(doc.key, e.target.files[0])}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                  />
                  <p className="text-gray-400 text-xs mt-2">Accepted formats: PDF, JPG, PNG (max 10MB)</p>
                </div>
              ))}
            </div>
          )}

          {/* Step 5: About & Final Details */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">About You</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Professional Bio *</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                  placeholder="Tell potential clients about your background, experience, and approach to therapy..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Therapeutic Approach *</label>
                <textarea
                  value={formData.approach}
                  onChange={(e) => handleInputChange('approach', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="Describe your therapeutic approach and methodologies..."
                  required
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    checked={formData.sportsExperience}
                    onChange={(e) => handleInputChange('sportsExperience', e.target.checked)}
                    className="rounded text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-white font-medium">I have experience with sports psychology</span>
                </label>

                {formData.sportsExperience && (
                  <textarea
                    value={formData.basketballExperience}
                    onChange={(e) => handleInputChange('basketballExperience', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="3"
                    placeholder="Describe your experience working with athletes, particularly basketball players..."
                  />
                )}
              </div>

              {/* Terms Agreement */}
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4">
                <label className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    required
                    className="rounded text-purple-500 focus:ring-purple-500 mt-1"
                  />
                  <span className="text-gray-300 text-sm">
                    I agree to the Terms of Service and Privacy Policy. I certify that all information provided is accurate and that I am licensed to practice in the state(s) indicated. I understand that my credentials will be verified before approval.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Previous
            </button>

            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" color="white" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Application'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistRegistrationPage;