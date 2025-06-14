
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Shield, Lock, Key, Eye, Fingerprint, AlertTriangle } from 'lucide-react';

const tools = [
  {
    name: 'Password Generator',
    description: 'Generate strong, secure passwords with customizable length, character sets, and complexity rules. Create unique passwords for maximum security.',
    link: '/tools/security/password-generator',
    icon: <Key className="h-8 w-8 text-blue-500" />
  },
  {
    name: 'Password Strength Checker',
    description: 'Analyze password strength and get recommendations for improvement. Check against common vulnerabilities and security best practices.',
    link: '/tools/security/password-checker',
    icon: <Shield className="h-8 w-8 text-green-500" />
  },
  {
    name: 'Hash Generator',
    description: 'Generate cryptographic hashes using MD5, SHA-1, SHA-256, and other algorithms. Perfect for data integrity verification and security applications.',
    link: '/tools/security/hash-generator',
    icon: <Fingerprint className="h-8 w-8 text-purple-500" />
  },
  {
    name: 'Text Encryption',
    description: 'Encrypt and decrypt sensitive text using various encryption algorithms. Protect confidential information with strong encryption methods.',
    link: '/tools/security/text-encryption',
    icon: <Lock className="h-8 w-8 text-orange-500" />
  },
  {
    name: 'Security Audit Tool',
    description: 'Audit your digital security posture with comprehensive checks for passwords, accounts, and security settings. Get actionable recommendations.',
    link: '/tools/security/security-audit',
    icon: <AlertTriangle className="h-8 w-8 text-red-500" />
  },
  {
    name: 'Privacy Scanner',
    description: 'Scan for privacy risks and data exposure across your digital footprint. Identify potential security vulnerabilities and privacy concerns.',
    link: '/tools/security/privacy-scanner',
    icon: <Eye className="h-8 w-8 text-indigo-500" />
  },
];

const passwordTools = [
    { name: 'Strong Password Generator', description: 'Generate secure passwords with custom rules and complexity.', link: '/tools/security/password-generator' },
    { name: 'Passphrase Generator', description: 'Create memorable passphrases using dictionary words.', link: '/tools/security/passphrase-generator' },
    { name: 'Password Strength Analyzer', description: 'Analyze and score password strength with detailed feedback.', link: '/tools/security/password-analyzer' },
    { name: 'Password Breach Checker', description: 'Check if passwords have been compromised in data breaches.', link: '/tools/security/breach-checker' },
    { name: 'Bulk Password Generator', description: 'Generate multiple unique passwords simultaneously.', link: '/tools/security/bulk-password-generator' },
    { name: 'Password Policy Generator', description: 'Create password policies for organizations and teams.', link: '/tools/security/password-policy' },
    { name: 'PIN Code Generator', description: 'Generate secure numeric PIN codes for various uses.', link: '/tools/security/pin-generator' },
    { name: 'Recovery Key Generator', description: 'Generate secure backup and recovery keys.', link: '/tools/security/recovery-key-generator' },
];

const encryptionTools = [
    { name: 'Text Encryption Tool', description: 'Encrypt and decrypt text using AES and other algorithms.', link: '/tools/security/text-encryption' },
    { name: 'File Encryption Tool', description: 'Encrypt files with password protection and strong algorithms.', link: '/tools/security/file-encryption' },
    { name: 'Base64 Encoder/Decoder', description: 'Encode and decode data using Base64 encoding.', link: '/tools/security/base64-encoder' },
    { name: 'Caesar Cipher Tool', description: 'Encrypt text using classical Caesar cipher methods.', link: '/tools/security/caesar-cipher' },
    { name: 'ROT13 Encoder', description: 'Apply ROT13 encoding for simple text obfuscation.', link: '/tools/security/rot13-encoder' },
    { name: 'Hash Generator', description: 'Generate MD5, SHA-1, SHA-256, and other cryptographic hashes.', link: '/tools/security/hash-generator' },
    { name: 'HMAC Generator', description: 'Generate Hash-based Message Authentication Codes.', link: '/tools/security/hmac-generator' },
    { name: 'Digital Signature Tool', description: 'Create and verify digital signatures for documents.', link: '/tools/security/digital-signature' },
];

const privacyTools = [
    { name: 'Privacy Scanner', description: 'Scan for privacy risks and data exposure vulnerabilities.', link: '/tools/security/privacy-scanner' },
    { name: 'Metadata Remover', description: 'Remove metadata and EXIF data from files and images.', link: '/tools/security/metadata-remover' },
    { name: 'Anonymous URL Generator', description: 'Create anonymous links to protect referrer information.', link: '/tools/security/anonymous-url' },
    { name: 'Secure File Shredder', description: 'Securely delete files with multiple overwrite passes.', link: '/tools/security/file-shredder' },
    { name: 'IP Address Lookup', description: 'Look up IP address information and geolocation data.', link: '/tools/security/ip-lookup' },
    { name: 'VPN Connection Tester', description: 'Test VPN connections and check for IP leaks.', link: '/tools/security/vpn-tester' },
    { name: 'Cookie Analyzer', description: 'Analyze website cookies and tracking technologies.', link: '/tools/security/cookie-analyzer' },
    { name: 'Browser Fingerprint Test', description: 'Test your browser fingerprint and privacy settings.', link: '/tools/security/fingerprint-test' },
];

const auditTools = [
    { name: 'Security Audit Dashboard', description: 'Comprehensive security audit with actionable recommendations.', link: '/tools/security/security-audit' },
    { name: 'Website Security Scanner', description: 'Scan websites for common security vulnerabilities.', link: '/tools/security/website-scanner' },
    { name: 'SSL Certificate Checker', description: 'Check SSL certificate validity and security configuration.', link: '/tools/security/ssl-checker' },
    { name: 'Port Security Scanner', description: 'Scan for open ports and potential security risks.', link: '/tools/security/port-scanner' },
    { name: 'Email Security Checker', description: 'Check email security settings and spam protection.', link: '/tools/security/email-security' },
    { name: 'Two-Factor Auth Setup', description: 'Guide for setting up two-factor authentication.', link: '/tools/security/2fa-setup' },
    { name: 'Security Checklist', description: 'Comprehensive security checklist for individuals and businesses.', link: '/tools/security/security-checklist' },
    { name: 'Vulnerability Database', description: 'Search common vulnerabilities and security advisories.', link: '/tools/security/vulnerability-db' },
];

const Security = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Professional Security & Privacy Tools
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
                Comprehensive security solutions for password management, encryption, privacy protection, and security auditing. Protect your digital life with professional-grade security tools.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.map((tool) => (
                <Link to={tool.link} key={tool.name} className="block group">
                  <Card className="h-full hover:shadow-lg hover:border-blue-500 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center space-x-4">
                      <div>{tool.icon}</div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="py-12 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Why Use Professional Security Tools?
              </h2>
              <div className="mt-6 max-w-4xl mx-auto text-left">
                <p className="text-lg text-gray-700 mb-6">
                  In today's interconnected digital world, cybersecurity threats are evolving at an unprecedented pace. From sophisticated phishing attacks to data breaches affecting millions of users, the need for robust security measures has never been more critical. Our comprehensive suite of security and privacy tools empowers individuals and organizations to take control of their digital security posture.
                </p>
                
                <p className="text-lg text-gray-700 mb-6">
                  Professional security tools provide multiple layers of protection that go far beyond basic antivirus software. They offer proactive defense mechanisms, helping you identify vulnerabilities before they can be exploited by malicious actors. Whether you're a security professional conducting penetration testing, a business owner protecting sensitive customer data, or an individual concerned about online privacy, our tools provide enterprise-grade security capabilities without the complexity.
                </p>

                <p className="text-lg text-gray-700 mb-6">
                  The importance of strong password management cannot be overstated. With the average person maintaining over 100 online accounts, using weak or repeated passwords creates a cascade of security risks. Our password generation and analysis tools help you create and maintain unique, cryptographically strong passwords for every account. Combined with our encryption tools, you can ensure that your sensitive information remains protected both in transit and at rest.
                </p>

                <p className="text-lg text-gray-700 mb-6">
                  Privacy protection has become equally important as security. Our privacy scanning and audit tools help you understand what information you're sharing online, identify potential data leaks, and provide actionable recommendations to enhance your digital privacy. From removing metadata from files to testing VPN connections, these tools give you complete visibility and control over your digital footprint.
                </p>

                <p className="text-lg text-gray-700 mb-6">
                  Beyond individual security, our tools also address organizational needs. Security auditing capabilities help businesses identify vulnerabilities across their digital infrastructure, while compliance tools ensure adherence to industry standards and regulations. The comprehensive nature of our security toolkit means you can address everything from basic password hygiene to advanced cryptographic operations in one integrated platform.
                </p>

                <p className="text-lg text-gray-700">
                  Explore our other professional tool categories: <Link to="/tools/text" className="text-blue-600 hover:underline">Text Processing Tools</Link>, <Link to="/tools/web" className="text-blue-600 hover:underline">Web Development Tools</Link>, <Link to="/tools/image" className="text-blue-600 hover:underline">Image Processing Tools</Link>, <Link to="/tools/calculators" className="text-blue-600 hover:underline">Advanced Calculators</Link>, <Link to="/tools/productivity" className="text-blue-600 hover:underline">Productivity Tools</Link>, <Link to="/tools/archive" className="text-blue-600 hover:underline">Archive Management</Link>, <Link to="/tools/video" className="text-blue-600 hover:underline">Video Processing</Link>, <Link to="/tools/audio" className="text-blue-600 hover:underline">Audio Tools</Link>, and <Link to="/tools/pdf" className="text-blue-600 hover:underline">PDF Management</Link>.
                </p>
              </div>
            </div>

            <div className="space-y-16">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Password Security</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {passwordTools.map((tool) => (
                    <Link to={tool.link} key={tool.name} className="block group">
                      <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Encryption & Cryptography</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {encryptionTools.map((tool) => (
                    <Link to={tool.link} key={tool.name} className="block group">
                      <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Privacy Protection</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {privacyTools.map((tool) => (
                    <Link to={tool.link} key={tool.name} className="block group">
                      <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Security Auditing</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {auditTools.map((tool) => (
                    <Link to={tool.link} key={tool.name} className="block group">
                      <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Security;
