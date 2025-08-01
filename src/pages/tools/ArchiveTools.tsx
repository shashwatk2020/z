import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Archive, FolderOpen, FileArchive, HardDrive, Package, Layers } from 'lucide-react';

const tools = [
  {
    name: 'ZIP Creator & Extractor',
    description: 'Create ZIP archives from multiple files or extract files from existing ZIP archives. Supports password protection and compression level settings.',
    link: '/tools/archive/zip-creator',
    icon: <FileArchive className="h-8 w-8 text-blue-500" />
  },
  {
    name: 'RAR Extractor',
    description: 'Extract files from RAR archives with full support for multi-part archives, password-protected files, and directory structure preservation.',
    link: '/tools/archive/rar-extractor',
    icon: <Package className="h-8 w-8 text-green-500" />
  },
  {
    name: 'Archive Converter',
    description: 'Convert between different archive formats including ZIP, RAR, 7Z, TAR, and more. Maintain compression and preserve file structures.',
    link: '/tools/archive/archive-converter',
    icon: <Archive className="h-8 w-8 text-purple-500" />
  },
  {
    name: 'File Compressor',
    description: 'Compress individual files or folders to reduce storage space and transfer time. Choose from various compression algorithms for optimal results.',
    link: '/tools/archive/file-compressor',
    icon: <Layers className="h-8 w-8 text-orange-500" />
  },
  {
    name: 'Archive Inspector',
    description: 'View archive contents without extracting, check file sizes, dates, and directory structures. Perfect for large archives and security verification.',
    link: '/tools/archive/archive-inspector',
    icon: <FolderOpen className="h-8 w-8 text-red-500" />
  },
  {
    name: 'Backup Creator',
    description: 'Create compressed backups of important files and folders with scheduling options. Organize and manage your backup archives efficiently.',
    link: '/tools/archive/backup-creator',
    icon: <HardDrive className="h-8 w-8 text-indigo-500" />
  },
];

const compressionTools = [
    { name: 'ZIP Archive Creator', description: 'Create ZIP files with multiple compression levels and password protection.', link: '/tools/archive/zip-creator' },
    { name: 'ZIP File Extractor', description: 'Extract files from ZIP archives while preserving folder structure.', link: '/tools/archive/zip-extractor' },
    { name: 'RAR File Extractor', description: 'Extract RAR archives including multi-part and encrypted files.', link: '/tools/archive/rar-extractor' },
    { name: '7-Zip Creator', description: 'Create highly compressed 7Z archives for maximum space savings.', link: '/tools/archive/7z-creator' },
    { name: 'TAR Archive Tool', description: 'Create and extract TAR archives commonly used in Linux systems.', link: '/tools/archive/tar-tool' },
    { name: 'GZIP Compressor', description: 'Compress files using GZIP algorithm for web optimization.', link: '/tools/archive/gzip-compressor' },
    { name: 'Multi-format Extractor', description: 'Extract files from multiple archive formats in one tool.', link: '/tools/archive/multi-extractor' },
    { name: 'Batch Archive Creator', description: 'Create multiple archives from folders automatically.', link: '/tools/archive/batch-creator' },
];

const conversionTools = [
    { name: 'Archive Format Converter', description: 'Convert between ZIP, RAR, 7Z, TAR, and other formats.', link: '/tools/archive/format-converter' },
    { name: 'ZIP to RAR Converter', description: 'Convert ZIP archives to RAR format with compression options.', link: '/tools/archive/zip-to-rar' },
    { name: 'RAR to ZIP Converter', description: 'Convert RAR files to universally compatible ZIP format.', link: '/tools/archive/rar-to-zip' },
    { name: '7Z to ZIP Converter', description: 'Convert 7-Zip archives to standard ZIP format.', link: '/tools/archive/7z-to-zip' },
    { name: 'TAR to ZIP Converter', description: 'Convert TAR archives to ZIP for Windows compatibility.', link: '/tools/archive/tar-to-zip' },
    { name: 'ISO File Extractor', description: 'Extract files from ISO disc images and optical media.', link: '/tools/archive/iso-extractor' },
    { name: 'CAB File Extractor', description: 'Extract Microsoft Cabinet (CAB) archive files.', link: '/tools/archive/cab-extractor' },
    { name: 'DMG File Extractor', description: 'Extract files from Mac disk image (DMG) files.', link: '/tools/archive/dmg-extractor' },
];

const managementTools = [
    { name: 'Archive Inspector', description: 'View archive contents and properties without extracting.', link: '/tools/archive/archive-inspector' },
    { name: 'File Size Analyzer', description: 'Analyze file sizes within archives and identify large files.', link: '/tools/archive/size-analyzer' },
    { name: 'Duplicate File Finder', description: 'Find duplicate files within archives to save space.', link: '/tools/archive/duplicate-finder' },
    { name: 'Archive Repair Tool', description: 'Attempt to repair corrupted or damaged archive files.', link: '/tools/archive/repair-tool' },
    { name: 'Password Recovery', description: 'Recover passwords from protected archive files.', link: '/tools/archive/password-recovery' },
    { name: 'Archive Splitter', description: 'Split large archives into smaller parts for easier transfer.', link: '/tools/archive/archive-splitter' },
    { name: 'Archive Merger', description: 'Merge multi-part archives back into single files.', link: '/tools/archive/archive-merger' },
    { name: 'Compression Analyzer', description: 'Compare compression ratios across different formats.', link: '/tools/archive/compression-analyzer' },
];

const backupTools = [
    { name: 'Backup Archive Creator', description: 'Create compressed backups with scheduling and automation.', link: '/tools/archive/backup-creator' },
    { name: 'Incremental Backup Tool', description: 'Create incremental backups to save time and space.', link: '/tools/archive/incremental-backup' },
    { name: 'Backup Restoration Tool', description: 'Restore files from backup archives with selective options.', link: '/tools/archive/backup-restore' },
    { name: 'Backup Verification', description: 'Verify integrity of backup archives and detect corruption.', link: '/tools/archive/backup-verify' },
    { name: 'Backup Scheduler', description: 'Schedule automatic backups with custom frequency settings.', link: '/tools/archive/backup-scheduler' },
    { name: 'Cloud Backup Sync', description: 'Sync backup archives with cloud storage services.', link: '/tools/archive/cloud-sync' },
    { name: 'Backup Catalog', description: 'Catalog and organize multiple backup archives.', link: '/tools/archive/backup-catalog' },
    { name: 'Backup Encryption', description: 'Encrypt backup archives for enhanced security.', link: '/tools/archive/backup-encryption' },
];

const ArchiveTools = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Professional Archive & Compression Tools
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
                Comprehensive file archiving, compression, and backup solutions. Create, extract, convert, and manage archives in all popular formats with professional-grade tools.
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
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">All Our Archive Tools</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">Complete archive management solutions for compression, extraction, conversion, and backup across all popular formats and platforms.</p>
                </div>

                <div className="space-y-16">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Compression & Extraction</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {compressionTools.map((tool) => (
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Format Conversion</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {conversionTools.map((tool) => (
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Archive Management</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {managementTools.map((tool) => (
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Backup Solutions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {backupTools.map((tool) => (
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

export default ArchiveTools;
