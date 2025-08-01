
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Shield, Key, Lock, Scan, Fingerprint, Mail, ListChecks, Database } from 'lucide-react';

const securityTools = [
  {
    name: 'Strong Password Generator',
    description: 'Generate strong, unique, and secure passwords for all your online accounts.',
    link: '/tools/security/strong-password-generator',
    icon: <Key className="h-8 w-8 text-blue-500" />
  },
  {
    name: 'Passphrase Generator',
    description: 'Create memorable yet secure passphrases using multiple random words.',
    link: '/tools/security/passphrase-generator',
    icon: <Key className="h-8 w-8 text-green-500" />
  },
  {
    name: 'Password Strength Analyzer',
    description: 'Evaluate the strength of your passwords and get recommendations for improvement.',
    link: '/tools/security/password-strength-analyzer',
    icon: <Scan className="h-8 w-8 text-purple-500" />
  },
  {
    name: 'Password Breach Checker',
    description: 'Check if your email or password has been compromised in known data breaches.',
    link: '/tools/security/password-breach-checker',
    icon: <Shield className="h-8 w-8 text-red-500" />
  },
  {
    name: 'Bulk Password Generator',
    description: 'Generate multiple strong passwords simultaneously for various uses.',
    link: '/tools/security/bulk-password-generator',
    icon: <Key className="h-8 w-8 text-orange-500" />
  },
  {
    name: 'Password Policy Generator',
    description: 'Create custom password policies for organizations or personal use.',
    link: '/tools/security/password-policy-generator',
    icon: <ListChecks className="h-8 w-8 text-indigo-500" />
  },
  {
    name: 'PIN Code Generator',
    description: 'Generate random and secure PIN codes for various applications.',
    link: '/tools/security/pin-code-generator',
    icon: <Key className="h-8 w-8 text-yellow-500" />
  },
  {
    name: 'Recovery Key Generator',
    description: 'Generate secure recovery keys for accounts and encryption.',
    link: '/tools/security/recovery-key-generator',
    icon: <Key className="h-8 w-8 text-teal-500" />
  },
  {
    name: 'Text Encryption Tool',
    description: 'Encrypt and decrypt text messages using various cryptographic algorithms.',
    link: '/tools/security/text-encryption-tool',
    icon: <Lock className="h-8 w-8 text-pink-500" />
  },
  {
    name: 'File Encryption Tool',
    description: 'Securely encrypt and decrypt files to protect sensitive data.',
    link: '/tools/security/file-encryption-tool',
    icon: <Lock className="h-8 w-8 text-cyan-500" />
  },
  {
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode data using Base64 encoding for secure transmission.',
    link: '/tools/security/base64-encoder-decoder',
    icon: <Lock className="h-8 w-8 text-lime-500" />
  },
  {
    name: 'Caesar Cipher Tool',
    description: 'Encrypt and decrypt messages using the classic Caesar cipher.',
    link: '/tools/security/caesar-cipher-tool',
    icon: <Lock className="h-8 w-8 text-amber-500" />
  },
  {
    name: 'ROT13 Encoder',
    description: 'Encode and decode text using the ROT13 substitution cipher.',
    link: '/tools/security/rot13-encoder',
    icon: <Lock className="h-8 w-8 text-lightBlue-500" />
  },
  {
    name: 'Hash Generator',
    description: 'Generate cryptographic hash values (MD5, SHA1, SHA256, etc.) for data integrity.',
    link: '/tools/security/hash-generator',
    icon: <Hash className="h-8 w-8 text-deepPurple-500" />
  },
  {
    name: 'HMAC Generator',
    description: 'Generate HMAC (Hash-based Message Authentication Code) for message authenticity.',
    link: '/tools/security/hmac-generator',
    icon: <Hash className="h-8 w-8 text-blueGray-500" />
  },
  {
    name: 'Digital Signature Tool',
    description: 'Create and verify digital signatures for documents and files.',
    link: '/tools/security/digital-signature-tool',
    icon: <Shield className="h-8 w-8 text-brown-500" />
  },
  {
    name: 'Privacy Scanner',
    description: 'Scan your system or online presence for privacy vulnerabilities and risks.',
    link: '/tools/security/privacy-scanner',
    icon: <Scan className="h-8 w-8 text-gray-500" />
  },
  {
    name: 'Metadata Remover',
    description: 'Remove sensitive metadata from images, documents, and other files.',
    link: '/tools/security/metadata-remover',
    icon: <Trash2 className="h-8 w-8 text-black" />
  },
  {
    name: 'Anonymous URL Generator',
    description: 'Generate anonymous and secure URLs to hide your browsing activity.',
    link: '/tools/security/anonymous-url-generator',
    icon: <Link className="h-8 w-8 text-blue-500" />
  },
  {
    name: 'Secure File Shredder',
    description: 'Securely delete files and folders beyond recovery to protect sensitive information.',
    link: '/tools/security/secure-file-shredder',
    icon: <Trash2 className="h-8 w-8 text-red-500" />
  },
  {
    name: 'IP Address Lookup',
    description: 'Look up geographical and network information for any IP address.',
    link: '/tools/security/ip-address-lookup',
    icon: <MapPin className="h-8 w-8 text-green-500" />
  },
  {
    name: 'VPN Connection Tester',
    description: 'Test your VPN connection for DNS leaks, IP leaks, and WebRTC leaks.',
    link: '/tools/security/vpn-connection-tester',
    icon: <Wifi className="h-8 w-8 text-blue-500" />
  },
  {
    name: 'Cookie Analyzer',
    description: 'Analyze website cookies to understand tracking and privacy implications.',
    link: '/tools/security/cookie-analyzer',
    icon: <Cookie className="h-8 w-8 text-orange-500" />
  },
  {
    name: 'Browser Fingerprint Test',
    description: 'Check how unique your browser fingerprint is and assess your online trackability.',
    link: '/tools/security/browser-fingerprint-test',
    icon: <Fingerprint className="h-8 w-8 text-purple-500" />
  },
  {
    name: 'Security Audit Dashboard',
    description: 'A dashboard to monitor and manage various aspects of your digital security.',
    link: '/tools/security/security-audit-dashboard',
    icon: <LayoutDashboard className="h-8 w-8 text-indigo-500" />
  },
  {
    name: 'Website Security Scanner',
    description: 'Scan websites for common security vulnerabilities and misconfigurations.',
    link: '/tools/security/website-security-scanner',
    icon: <Scan className="h-8 w-8 text-red-500" />
  },
  {
    name: 'SSL Certificate Checker',
    description: 'Verify the validity and details of SSL/TLS certificates for any website.',
    link: '/tools/security/ssl-certificate-checker',
    icon: <ShieldCheck className="h-8 w-8 text-green-500" />
  },
  {
    name: 'Port Security Scanner',
    description: 'Scan open ports on a server or network to identify potential security risks.',
    link: '/tools/security/port-security-scanner',
    icon: <HardDrive className="h-8 w-8 text-gray-500" />
  },
  {
    name: 'Email Security Checker',
    description: 'Analyze email headers and content for phishing, spam, and other threats.',
    link: '/tools/security/email-security-checker',
    icon: <Mail className="h-8 w-8 text-blue-500" />
  },
  {
    name: 'Two-Factor Auth Setup',
    description: 'Guidance and tools to set up two-factor authentication for your accounts.',
    link: '/tools/security/two-factor-auth-setup',
    icon: <Shield className="h-8 w-8 text-green-500" />
  },
  {
    name: 'Security Checklist',
    description: 'A comprehensive checklist to improve your overall digital security posture.',
    link: '/tools/security/security-checklist',
    icon: <ListChecks className="h-8 w-8 text-purple-500" />
  },
  {
    name: 'Vulnerability Database',
    description: 'Search and browse a database of known software vulnerabilities and exploits.',
    link: '/tools/security/vulnerability-database',
    icon: <Database className="h-8 w-8 text-red-500" />
  },
];

const Security = () => {
  return (
    <Layout>
      <div className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Advanced Security Tools
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
              Comprehensive tools to enhance your digital security, protect your privacy, and safeguard your data.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityTools.map((tool) => (
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
    </Layout>
  );
};

export default Security;
