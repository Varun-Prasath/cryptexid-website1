import React, { useState, useRef, useEffect, memo } from 'react';
import { Shield, User, Globe, Zap, ChevronRight, Menu, X, CheckCircle, Sparkles, Lock, Database, Cpu, Eye, Heart, Award, Users, Mail, Phone, MapPin, Github, Twitter, Linkedin, ExternalLink, Camera, XCircle, RefreshCw, Mic, MicOff, Volume2, Play, Star, Clock, Bell, ArrowRight, Download, Share, Settings, LogOut, Home, Activity, FileText, CreditCard } from 'lucide-react';

// Main Component
const CryptexIDWebsite = () => {
  // UI State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [verificationStep, setVerificationStep] = useState('camera'); // camera, analyzing, voice, voiceRecording, voiceAnalyzing, complete, error
  const [cameraStream, setCameraStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voicePhrase, setVoicePhrase] = useState('');
  const [audioPlayback, setAudioPlayback] = useState(null);
  const [cryptxToken, setCryptxToken] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  // Face Verification Functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 }, 
          facingMode: 'user' 
        } 
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(error => {
            console.log('Video play interrupted:', error);
          });
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setVerificationStep('error');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureAndVerify = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      setVerificationStep('analyzing');
      
      // Simulate verification process
      setTimeout(() => {
        // Simulate 95% success rate
        const success = Math.random() > 0.05;
        if (success) {
          setVerificationStep('voice');
          generateVoicePhrase();
        } else {
          setVerificationStep('error');
        }
        stopCamera();
      }, 3000);
    }
  };

  // Voice Verification Functions
  const voicePhrases = [
    "My voice is my unique identity",
    "Secure digital India for everyone",
    "Technology empowers our future",
    "Innovation drives progress forward",
    "Digital security is our priority",
    "Blockchain ensures data integrity"
  ];

  const generateVoicePhrase = () => {
    const randomPhrase = voicePhrases[Math.floor(Math.random() * voicePhrases.length)];
    setVoicePhrase(randomPhrase);
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioPlayback(audioUrl);
        setAudioChunks(chunks);
        analyzeVoice();
        
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      setVerificationStep('voiceRecording');

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 10) { // Auto-stop after 10 seconds
            stopVoiceRecording();
            return prev;
          }
          return prev + 0.1;
        });
      }, 100);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      setVerificationStep('error');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setVerificationStep('voiceAnalyzing');
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const analyzeVoice = () => {
    // Simulate voice analysis process
    setTimeout(() => {
      // Simulate 90% success rate for voice verification
      const success = Math.random() > 0.1;
      if (success) {
        generateCryptxToken();
        setVerificationStep('complete');
      } else {
        setVerificationStep('error');
      }
    }, 4000);
  };

  const playRecordedAudio = () => {
    if (audioPlayback) {
      const audio = new Audio(audioPlayback);
      audio.play();
    }
  };

  const generateCryptxToken = () => {
    // Generate a realistic-looking token
    const timestamp = Date.now();
    const randomBytes = Array.from({length: 16}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
    const token = `CXTK_${timestamp.toString(36).toUpperCase()}_${randomBytes.toUpperCase()}`;
    setCryptxToken(token);
  };

  const resetVerification = () => {
    setVerificationStep('camera');
    setRecordingTime(0);
    setAudioChunks([]);
    setAudioPlayback(null);
    setCryptxToken('');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopCamera();
  };

  const closeVerification = () => {
    setShowVerification(false);
    resetVerification();
  };

  const openDashboard = () => {
    setShowVerification(false);
    setShowDashboard(true);
  };

  const handleGetStarted = () => {
    setShowVerification(true);
    setVerificationStep('camera');
  };

  useEffect(() => {
    if (showVerification && verificationStep === 'camera') {
      // Add a small delay to ensure the video element is mounted
      const timer = setTimeout(() => {
        startCamera();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showVerification, verificationStep]);

  useEffect(() => {
    return () => {
      stopCamera();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Face Verification Modal
  const FaceVerificationModal = memo(() => {
    if (!showVerification) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={closeVerification}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          {verificationStep === 'camera' && (
            <div className="text-center">
              <div className="mb-6">
                <Camera className="text-orange-600 mx-auto mb-4" size={48} />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Face Verification</h3>
                <p className="text-gray-600">Position your face in the frame and click verify when ready</p>
              </div>
              
              <div className="relative mb-6 bg-black rounded-xl overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scale-x-[-1]"
                  style={{ minHeight: '300px' }}
                />
                <div className="absolute inset-4 border-2 border-dashed border-orange-400 rounded-xl pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-52 border-2 border-orange-500 rounded-full opacity-60"></div>
                </div>
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Camera status indicator */}
                <div className="absolute top-4 left-4 flex items-center bg-black/50 rounded-full px-3 py-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-white text-xs font-medium">LIVE</span>
                </div>
              </div>
              
              <button
                onClick={captureAndVerify}
                disabled={!cameraStream}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
              >
                <Camera className="mr-2" size={20} />
                {cameraStream ? 'Verify Face' : 'Starting camera...'}
              </button>
            </div>
          )}

          {verificationStep === 'analyzing' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <RefreshCw className="text-white animate-spin" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Biometric Analysis</h3>
                <p className="text-gray-600 mb-4">Processing your facial features with AI technology...</p>
              </div>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span className="text-gray-600">Facial geometry detected</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span className="text-gray-600">Liveness verification passed</span>
                </div>
                <div className="flex items-center">
                  <RefreshCw className="text-orange-500 mr-3 animate-spin" size={20} />
                  <span className="text-gray-600">Creating biometric signature...</span>
                </div>
              </div>
            </div>
          )}

          {verificationStep === 'voice' && (
            <div className="text-center">
              <div className="mb-6">
                <Mic className="text-green-600 mx-auto mb-4" size={48} />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Voice Verification</h3>
                <p className="text-gray-600 mb-4">Please speak the following phrase clearly</p>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center mb-3">
                  <Volume2 className="text-gray-500 mr-2" size={20} />
                  <span className="text-sm text-gray-500 font-medium">Speak clearly</span>
                </div>
                <p className="text-lg font-medium text-gray-800 leading-relaxed">
                  "{voicePhrase}"
                </p>
              </div>
              
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2">
                  Speak clearly and naturally • Maximum 10 seconds
                </div>
              </div>
              
              <button
                onClick={startVoiceRecording}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
              >
                <Mic className="mr-2" size={20} />
                Start Recording
              </button>
            </div>
          )}

          {verificationStep === 'voiceRecording' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Mic className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Recording Voice...</h3>
                <p className="text-gray-600 mb-4">Speak clearly into your microphone</p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-6 mb-6">
                <p className="text-lg font-medium text-gray-800 mb-4">
                  "{voicePhrase}"
                </p>
                <div className="text-3xl font-bold text-red-600">
                  {recordingTime.toFixed(1)}s
                </div>
                <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${(recordingTime / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <button
                onClick={stopVoiceRecording}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
              >
                <MicOff className="mr-2" size={20} />
                Stop Recording
              </button>
            </div>
          )}

          {verificationStep === 'voiceAnalyzing' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <RefreshCw className="text-white animate-spin" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Voice Pattern Analysis</h3>
                <p className="text-gray-600 mb-4">Processing your voice biometrics with AI...</p>
              </div>
              
              <div className="space-y-3 text-left mb-6">
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span className="text-gray-600">Voice pattern extracted</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span className="text-gray-600">Phrase verification passed</span>
                </div>
                <div className="flex items-center">
                  <RefreshCw className="text-blue-500 mr-3 animate-spin" size={20} />
                  <span className="text-gray-600">Creating voice signature...</span>
                </div>
              </div>

              {audioPlayback && (
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Your recording:</span>
                    <button
                      onClick={playRecordedAudio}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Play size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {verificationStep === 'complete' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Verification Complete!</h3>
                <p className="text-gray-600">Your biometric identity has been secured on the blockchain</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="text-center">
                    <div className="font-semibold text-green-800">Face Match</div>
                    <div className="text-green-600">98.7%</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-800">Voice Match</div>
                    <div className="text-green-600">96.3%</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-green-800">Overall Score</div>
                    <div className="text-green-600">97.5%</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-800">Processing Time</div>
                    <div className="text-green-600">3.7s</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <Lock className="text-blue-600 mt-1 mr-3" size={16} />
                  <div className="text-left">
                    <div className="font-semibold text-blue-800 text-sm">Blockchain Secured</div>
                    <div className="text-blue-600 text-xs">Your biometric signature is now protected by immutable blockchain technology</div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={openDashboard}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  View Dashboard
                </button>
                <button
                  onClick={closeVerification}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {verificationStep === 'error' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h3>
                <p className="text-gray-600">Please check the requirements and try again</p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 mb-6">
                <ul className="text-sm text-red-800 space-y-1 text-left">
                  <li>• Ensure your face is clearly visible in the frame</li>
                  <li>• Speak clearly and naturally for voice verification</li>
                  <li>• Use a quiet environment for better audio quality</li>
                  <li>• Remove sunglasses or face coverings</li>
                  <li>• Look directly at the camera</li>
                </ul>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={resetVerification}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Try Again
                </button>
                <button
                  onClick={closeVerification}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  });

  // Dashboard Component
  const Dashboard = memo(() => {
    if (!showDashboard) return null;

    const [activeTab, setActiveTab] = useState('overview');
    const [notifications] = useState([
      { id: 1, type: 'success', message: 'Identity verification completed successfully', time: '2 minutes ago' },
      { id: 2, type: 'info', message: 'New login from Bangalore, Karnataka', time: '1 hour ago' },
      { id: 3, type: 'warning', message: 'Biometric pattern updated', time: '3 hours ago' }
    ]);

    return (
      <div className="fixed inset-0 z-50 bg-gray-100">
        {/* Dashboard Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-gray-900">
                  Cryptex<span className="text-orange-600">ID</span>
                </div>
                <div className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  Verified
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell size={20} />
                  </button>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">AK</span>
                  </div>
                  <span className="text-gray-700 font-medium">Arjun Kumar</span>
                </div>
                
                <button 
                  onClick={() => setShowDashboard(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-lg">
            <nav className="mt-8">
              {[
                { id: 'overview', name: 'Overview', icon: <Home size={20} /> },
                { id: 'identity', name: 'Identity Profile', icon: <User size={20} /> },
                { id: 'security', name: 'Security', icon: <Shield size={20} /> },
                { id: 'activity', name: 'Activity Log', icon: <Activity size={20} /> },
                { id: 'settings', name: 'Settings', icon: <Settings size={20} /> }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                    activeTab === item.id ? 'bg-orange-50 border-r-2 border-orange-600 text-orange-700' : 'text-gray-600'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              {activeTab === 'overview' && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-8">Identity Dashboard</h1>
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <CheckCircle className="text-green-600" size={24} />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-600">Verification Status</p>
                          <p className="text-2xl font-bold text-gray-900">Verified</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                          <Shield className="text-orange-600" size={24} />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-600">Security Score</p>
                          <p className="text-2xl font-bold text-gray-900">97.5%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Globe className="text-blue-600" size={24} />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-600">Active Sessions</p>
                          <p className="text-2xl font-bold text-gray-900">3</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Clock className="text-green-600" size={24} />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-600">Last Login</p>
                          <p className="text-2xl font-bold text-gray-900">Now</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CryptX Token Card */}
                  <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 mb-8 text-white">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Your CryptX ID Token</h2>
                        <p className="text-orange-100">Blockchain-secured identity signature</p>
                      </div>
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Lock className="text-white" size={32} />
                      </div>
                    </div>
                    
                    <div className="bg-white/10 rounded-xl p-6">
                      <div className="text-xs text-orange-100 mb-2">TOKEN ID</div>
                      <div className="font-mono text-lg break-all mb-4">
                        {cryptxToken || 'CXTK_L8K9M2X4_A1B2C3D4E5F6G7H8I9J0'}
                      </div>
                      <div className="flex space-x-4">
                        <button className="flex items-center text-white/80 hover:text-white text-sm">
                          <Share className="mr-1" size={16} />
                          Share
                        </button>
                        <button className="flex items-center text-white/80 hover:text-white text-sm">
                          <Download className="mr-1" size={16} />
                          Export
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl shadow-sm border mb-8">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {notifications.map((notification) => (
                          <div key={notification.id} className="flex items-start space-x-3">
                            <div className={`w-3 h-3 rounded-full mt-2 ${
                              notification.type === 'success' ? 'bg-green-500' :
                              notification.type === 'info' ? 'bg-blue-500' : 'bg-orange-500'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-gray-900">{notification.message}</p>
                              <p className="text-sm text-gray-500">{notification.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-shadow text-left">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                        <RefreshCw className="text-blue-600" size={24} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Re-verify Identity</h3>
                      <p className="text-sm text-gray-600">Update your biometric patterns</p>
                    </button>

                    <button className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-shadow text-left">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                        <Download className="text-green-600" size={24} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Export Credentials</h3>
                      <p className="text-sm text-gray-600">Download your digital certificates</p>
                    </button>

                    <button className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-shadow text-left">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                        <Share className="text-purple-600" size={24} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Share Profile</h3>
                      <p className="text-sm text-gray-600">Generate shareable identity proof</p>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'identity' && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-8">Identity Profile</h1>
                  
                  <div className="bg-white rounded-2xl shadow-sm border p-8">
                    <div className="flex items-center mb-8">
                      <div className="w-24 h-24 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-6">
                        AK
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Arjun Kumar</h2>
                        <p className="text-gray-600">Verified Digital Identity</p>
                        <div className="flex items-center mt-2">
                          <CheckCircle className="text-green-500 mr-2" size={16} />
                          <span className="text-sm text-green-600 font-medium">Fully Verified</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-500">Full Name</label>
                            <p className="text-gray-900 font-medium">Arjun Kumar</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Date of Birth</label>
                            <p className="text-gray-900 font-medium">March 15, 1992</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Nationality</label>
                            <p className="text-gray-900 font-medium">Indian</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Face Recognition</span>
                            <div className="flex items-center">
                              <CheckCircle className="text-green-500 mr-2" size={16} />
                              <span className="text-green-600 text-sm">Verified</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Voice Pattern</span>
                            <div className="flex items-center">
                              <CheckCircle className="text-green-500 mr-2" size={16} />
                              <span className="text-green-600 text-sm">Verified</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Blockchain Record</span>
                            <div className="flex items-center">
                              <CheckCircle className="text-green-500 mr-2" size={16} />
                              <span className="text-green-600 text-sm">Secured</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-8">Security Center</h1>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-sm border p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Security Score</h2>
                      <div className="text-center mb-6">
                        <div className="text-5xl font-bold text-green-600 mb-2">97.5%</div>
                        <p className="text-gray-600">Excellent Security Level</p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Biometric Strength</span>
                          <span className="text-green-600 font-semibold">High</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Encryption Level</span>
                          <span className="text-green-600 font-semibold">256-bit</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Blockchain Security</span>
                          <span className="text-green-600 font-semibold">Active</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Active Sessions</h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                            <div>
                              <p className="font-medium text-gray-900">Current Session</p>
                              <p className="text-sm text-gray-500">Bangalore, Karnataka</p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">Now</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                            <div>
                              <p className="font-medium text-gray-900">Mobile App</p>
                              <p className="text-sm text-gray-500">Mumbai, Maharashtra</p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">2h ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-8">Activity Log</h1>
                  
                  <div className="bg-white rounded-2xl shadow-sm border">
                    <div className="p-6">
                      <div className="space-y-6">
                        {[
                          { type: 'verification', action: 'Identity verification completed', time: '2 minutes ago', icon: CheckCircle, color: 'text-green-600' },
                          { type: 'login', action: 'New login from Bangalore, Karnataka', time: '1 hour ago', icon: Globe, color: 'text-blue-600' },
                          { type: 'update', action: 'Biometric pattern updated', time: '3 hours ago', icon: RefreshCw, color: 'text-orange-600' },
                          { type: 'security', action: 'Security settings modified', time: '1 day ago', icon: Shield, color: 'text-purple-600' },
                          { type: 'export', action: 'Credentials exported', time: '2 days ago', icon: Download, color: 'text-gray-600' }
                        ].map((activity, index) => (
                          <div key={index} className="flex items-start space-x-4 pb-6 border-b border-gray-100 last:border-b-0">
                            <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
                              <activity.icon size={20} />
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-900 font-medium">{activity.action}</p>
                              <p className="text-sm text-gray-500">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
                  
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy & Security</h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-600">Add an extra layer of security</p>
                          </div>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                            Enabled
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">Biometric Lock</h3>
                            <p className="text-sm text-gray-600">Require biometric verification for sensitive actions</p>
                          </div>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                            Active
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Notifications</h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">Security Alerts</h3>
                            <p className="text-sm text-gray-600">Get notified of suspicious activities</p>
                          </div>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                            On
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">Login Notifications</h3>
                            <p className="text-sm text-gray-600">Alert when someone logs into your account</p>
                          </div>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                            On
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  });

  // Main Landing Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <FaceVerificationModal />
      <Dashboard />
      
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-gray-900">
                Cryptex<span className="text-orange-600">ID</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">How It Works</a>
              <a href="#security" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Security</a>
              <a href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Contact</a>
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-orange-100">
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-gray-700 hover:text-orange-600 transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="block text-gray-700 hover:text-orange-600 transition-colors font-medium">How It Works</a>
              <a href="#security" className="block text-gray-700 hover:text-orange-600 transition-colors font-medium">Security</a>
              <a href="#contact" className="block text-gray-700 hover:text-orange-600 transition-colors font-medium">Contact</a>
              <button 
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-red-100/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 rounded-2xl shadow-lg">
                <Shield className="text-white" size={48} />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Your Digital Identity,
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> Secured</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
              Revolutionary biometric authentication combining face recognition, voice patterns, and blockchain technology 
              to create your unbreakable digital identity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
              >
                <Sparkles className="mr-3" size={24} />
                Start Verification
                <ArrowRight className="ml-3" size={24} />
              </button>
              
              <button className="text-gray-700 hover:text-orange-600 font-semibold text-lg flex items-center transition-colors">
                <Play className="mr-2" size={20} />
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              <div className="flex items-center justify-center">
                <Shield className="text-gray-400 mr-2" size={24} />
                <span className="text-gray-500 font-medium">Bank-Grade Security</span>
              </div>
              <div className="flex items-center justify-center">
                <Database className="text-gray-400 mr-2" size={24} />
                <span className="text-gray-500 font-medium">Blockchain Protected</span>
              </div>
              <div className="flex items-center justify-center">
                <Cpu className="text-gray-400 mr-2" size={24} />
                <span className="text-gray-500 font-medium">AI-Powered</span>
              </div>
              <div className="flex items-center justify-center">
                <Globe className="text-gray-400 mr-2" size={24} />
                <span className="text-gray-500 font-medium">Global Standard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Next-Generation Biometric Security
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of identity verification with our cutting-edge technology stack
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Eye className="text-orange-600" size={32} />,
                title: "Advanced Face Recognition",
                description: "3D facial mapping with liveness detection ensures only real faces are verified, preventing spoofing attempts."
              },
              {
                icon: <Mic className="text-green-600" size={32} />,
                title: "Voice Pattern Analysis",
                description: "Unique vocal characteristics create an unbreakable voice signature using advanced audio processing."
              },
              {
                icon: <Lock className="text-blue-600" size={32} />,
                title: "Blockchain Security",
                description: "Immutable biometric signatures stored on distributed ledger technology for ultimate protection."
              },
              {
                icon: <Zap className="text-purple-600" size={32} />,
                title: "Lightning Fast",
                description: "Complete verification in under 5 seconds with 99.7% accuracy using optimized AI algorithms."
              },
              {
                icon: <Globe className="text-teal-600" size={32} />,
                title: "Universal Access",
                description: "Works seamlessly across all devices and platforms with consistent user experience."
              },
              {
                icon: <Heart className="text-red-600" size={32} />,
                title: "Privacy First",
                description: "Zero-knowledge architecture ensures your biometric data never leaves your device unencrypted."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-200 group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple. Secure. Revolutionary.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get verified in three simple steps and join the digital identity revolution
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                icon: <Camera className="text-orange-600" size={48} />,
                title: "Capture Your Face",
                description: "Our advanced 3D facial recognition technology maps your unique facial geometry with military-grade precision.",
                details: ["3D facial mapping", "Liveness detection", "Anti-spoofing protection"]
              },
              {
                step: "02",
                icon: <Mic className="text-green-600" size={48} />,
                title: "Record Voice Pattern",
                description: "Speak a simple phrase to create your unique voice signature using advanced audio biometric analysis.",
                details: ["Voice pattern analysis", "Audio processing", "Secure voice signature"]
              },
              {
                step: "03",
                icon: <Lock className="text-blue-600" size={48} />,
                title: "Blockchain Protection",
                description: "Your biometric signature is encrypted and secured on the blockchain, creating an immutable digital identity.",
                details: ["Blockchain storage", "Immutable records", "Decentralized security"]
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                  <div className="text-6xl font-bold text-gray-100 mb-4">{step.step}</div>
                  
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    {step.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>
                  
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="text-green-500 mr-2" size={16} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {index < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                    <ChevronRight className="text-gray-300" size={32} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Enterprise-Grade Security Architecture
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Database className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Distributed Ledger Technology</h3>
                    <p className="text-gray-600">Your biometric data is secured across multiple blockchain nodes, making it virtually impossible to compromise or alter.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Zero-Knowledge Architecture</h3>
                    <p className="text-gray-600">We never store your raw biometric data. Only encrypted mathematical representations are processed and stored.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Cpu className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced AI Protection</h3>
                    <p className="text-gray-600">Machine learning algorithms continuously monitor for threats and adapt security measures in real-time.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Experience Security
              </button>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Security Dashboard</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">SECURE</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl">
                    <span className="text-gray-300">Encryption Level</span>
                    <span className="text-green-400 font-bold">AES-256</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl">
                    <span className="text-gray-300">Blockchain Nodes</span>
                    <span className="text-blue-400 font-bold">1,847 Active</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl">
                    <span className="text-gray-300">Threat Detection</span>
                    <span className="text-green-400 font-bold">99.99% Uptime</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl">
                    <span className="text-gray-300">Identity Score</span>
                    <span className="text-green-400 font-bold">98.7%</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl border border-green-500/30">
                  <div className="flex items-center">
                    <CheckCircle className="text-green-400 mr-3" size={20} />
                    <span className="text-green-100 font-medium">All systems operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">99.7%</div>
              <div className="text-orange-100 font-medium">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">&lt;3s</div>
              <div className="text-orange-100 font-medium">Verification Time</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1M+</div>
              <div className="text-orange-100 font-medium">Verified Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-orange-100 font-medium">System Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600">
              See what our users say about CryptexID
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Priya Sharma",
                role: "Chief Technology Officer, FinTech Corp",
                content: "CryptexID has revolutionized our customer onboarding process. The biometric verification is seamless and incredibly secure.",
                rating: 5,
                avatar: "PS"
              },
              {
                name: "Rajesh Gupta",
                role: "Security Director, Banking Solutions",
                content: "The blockchain integration gives us confidence that our customer identities are protected with the highest level of security.",
                rating: 5,
                avatar: "RG"
              },
              {
                name: "Sarah Johnson",
                role: "Product Manager, Digital Identity",
                content: "Implementation was smooth, and our users love how quick and easy the verification process is. Outstanding technology!",
                rating: 5,
                avatar: "SJ"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Ready to Secure Your Digital Identity?
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Join millions of users who trust CryptexID for their digital identity verification. 
            Get started in less than 60 seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Verification Now
            </button>
            
            <button className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200">
              Learn More
            </button>
          </div>
          
          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center">
              <CheckCircle className="mr-2" size={16} />
              Free to start
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2" size={16} />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2" size={16} />
              Enterprise ready
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-bold text-gray-900 mb-4">
                Cryptex<span className="text-orange-600">ID</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                Revolutionizing digital identity with advanced biometric authentication and blockchain security. 
                Your identity, secured for the digital age.
              </p>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-gray-100 hover:bg-orange-100 rounded-lg flex items-center justify-center transition-colors">
                  <Twitter className="text-gray-600 hover:text-orange-600" size={20} />
                </button>
                <button className="w-10 h-10 bg-gray-100 hover:bg-orange-100 rounded-lg flex items-center justify-center transition-colors">
                  <Linkedin className="text-gray-600 hover:text-orange-600" size={20} />
                </button>
                <button className="w-10 h-10 bg-gray-100 hover:bg-orange-100 rounded-lg flex items-center justify-center transition-colors">
                  <Github className="text-gray-600 hover:text-orange-600" size={20} />
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-orange-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-orange-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 text-sm">
                © 2024 CryptexID. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-600 hover:text-orange-600 text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-600 hover:text-orange-600 text-sm transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-600 hover:text-orange-600 text-sm transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CryptexIDWebsite;
