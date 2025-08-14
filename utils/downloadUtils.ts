export interface DownloadOptions {
  filename?: string
  contentType?: string
  showNotification?: boolean
  onProgress?: (progress: number) => void
  onComplete?: () => void
  onError?: (error: Error) => void
}

export const downloadUtils = {
  /**
   * Download text content as a file
   */
  downloadText: async (
    content: string,
    filename: string,
    options: DownloadOptions = {}
  ): Promise<void> => {
    try {
      const blob = new Blob([content], {
        type: options.contentType || 'text/plain;charset=utf-8'
      })
      
      await downloadUtils.downloadBlob(blob, filename, options)
    } catch (error) {
      console.error('Error downloading text:', error)
      options.onError?.(error as Error)
      throw error
    }
  },

  /**
   * Download JSON content as a file
   */
  downloadJSON: async (
    data: any,
    filename: string,
    options: DownloadOptions = {}
  ): Promise<void> => {
    try {
      const content = JSON.stringify(data, null, 2)
      await downloadUtils.downloadText(content, filename, {
        contentType: 'application/json',
        ...options
      })
    } catch (error) {
      console.error('Error downloading JSON:', error)
      options.onError?.(error as Error)
      throw error
    }
  },

  /**
   * Download CSV content as a file
   */
  downloadCSV: async (
    data: any[],
    filename: string,
    options: DownloadOptions = {}
  ): Promise<void> => {
    try {
      if (data.length === 0) {
        throw new Error('No data to export')
      }

      const headers = Object.keys(data[0])
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header]
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"` 
              : value
          }).join(',')
        )
      ].join('\n')

      await downloadUtils.downloadText(csvContent, filename, {
        contentType: 'text/csv',
        ...options
      })
    } catch (error) {
      console.error('Error downloading CSV:', error)
      options.onError?.(error as Error)
      throw error
    }
  },

  /**
   * Download a blob as a file
   */
  downloadBlob: async (
    blob: Blob,
    filename: string,
    options: DownloadOptions = {}
  ): Promise<void> => {
    try {
      // Simulate progress if callback provided
      if (options.onProgress) {
        for (let i = 0; i <= 100; i += 10) {
          options.onProgress(i)
          await new Promise(resolve => setTimeout(resolve, 50))
        }
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = options.filename || filename
      link.style.display = 'none'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      
      options.onComplete?.()
    } catch (error) {
      console.error('Error downloading blob:', error)
      options.onError?.(error as Error)
      throw error
    }
  },

  /**
   * Download from a URL
   */
  downloadFromURL: async (
    url: string,
    filename: string,
    options: DownloadOptions = {}
  ): Promise<void> => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const blob = await response.blob()
      await downloadUtils.downloadBlob(blob, filename, options)
    } catch (error) {
      console.error('Error downloading from URL:', error)
      options.onError?.(error as Error)
      throw error
    }
  },

  /**
   * Generate document content based on document type
   */
  generateDocumentContent: (documentName: string, documentType: string = 'general'): string => {
    const timestamp = new Date().toISOString()
    
    switch (documentType.toLowerCase()) {
      case 'firm overview':
        return `FIRM OVERVIEW DOCUMENT

Title: ${documentName}
Document Type: Firm Overview
Generated: ${timestamp}

EXECUTIVE SUMMARY
This document provides a comprehensive overview of the firm's capabilities, 
investment philosophy, and track record.

KEY HIGHLIGHTS
• Established track record of delivering strong risk-adjusted returns
• Comprehensive investment capabilities across multiple asset classes
• Robust risk management and compliance frameworks
• Global presence with local expertise

INVESTMENT CAPABILITIES
• Public Equity
• Fixed Income
• Private Equity
• Real Estate
• Infrastructure
• Private Credit
• Multi-Asset Solutions

This document contains confidential information and is intended for authorized recipients only.`

      case 'esg policy':
        return `ESG POLICY STATEMENT

Title: ${documentName}
Document Type: ESG Policy Statement
Generated: ${timestamp}

ENVIRONMENTAL, SOCIAL, AND GOVERNANCE (ESG) POLICY

MISSION STATEMENT
We are committed to integrating ESG considerations into our investment processes 
and engaging with companies to promote sustainable business practices.

ENVIRONMENTAL FOCUS
• Climate risk assessment and management
• Carbon footprint reduction initiatives
• Renewable energy investment strategies
• Sustainable infrastructure development

SOCIAL RESPONSIBILITY
• Diversity, equity, and inclusion programs
• Community investment and philanthropy
• Human rights and labor standards
• Stakeholder engagement practices

GOVERNANCE EXCELLENCE
• Board diversity and independence
• Executive compensation alignment
• Risk management frameworks
• Transparency and disclosure standards

This policy statement reflects our commitment to sustainable investing and 
responsible stewardship of client assets.`

      case 'annual report':
        return `ANNUAL REPORT

Title: ${documentName}
Document Type: Annual Report
Generated: ${timestamp}

LETTER TO SHAREHOLDERS
Dear Shareholders,

This annual report provides a comprehensive overview of our performance and 
strategic direction for the past year.

FINANCIAL HIGHLIGHTS
• Revenue growth and profitability metrics
• Asset under management performance
• Investment returns and benchmarks
• Operational efficiency improvements

STRATEGIC ACHIEVEMENTS
• Technology and platform enhancements
• ESG integration and sustainable investing
• Global expansion and market presence
• Innovation in investment solutions

INVESTMENT PERFORMANCE
• Portfolio performance across asset classes
• Risk-adjusted returns and benchmarks
• Investment strategy effectiveness
• Client satisfaction and retention

OUTLOOK
We remain optimistic about our long-term prospects and our ability to deliver 
value for shareholders while serving our clients' evolving needs.

This annual report provides a comprehensive overview of our performance and 
strategic direction.`

      case 'ddq':
        return `DUE DILIGENCE QUESTIONNAIRE

Title: ${documentName}
Document Type: Due Diligence Questionnaire
Generated: ${timestamp}

DUE DILIGENCE QUESTIONNAIRE EXPORT

This document contains the complete due diligence questionnaire responses 
and supporting documentation.

SECTIONS INCLUDED:
• Firm Overview and History
• Investment Philosophy and Process
• Risk Management Framework
• Performance Track Record
• Compliance and Regulatory
• Operational Infrastructure
• ESG Integration
• Fee Structure and Terms

RESPONSES:
[Detailed questionnaire responses would be included here]

SUPPORTING DOCUMENTATION:
• Financial statements
• Performance data
• Compliance certificates
• Organizational charts
• Risk management policies

This document is confidential and intended for authorized due diligence purposes only.`

      default:
        return `DOCUMENT

Title: ${documentName}
Document Type: General Document
Generated: ${timestamp}

This is a sample document for ${documentName}. 

CONTENT:
This document contains relevant information and should be reviewed carefully.

For more information, please contact the appropriate team member.

Generated: ${timestamp}`
    }
  },

  /**
   * Download a document with generated content
   */
  downloadDocument: async (
    documentName: string,
    documentType: string = 'general',
    options: DownloadOptions = {}
  ): Promise<void> => {
    try {
      const content = downloadUtils.generateDocumentContent(documentName, documentType)
      const filename = `${documentName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
      
      await downloadUtils.downloadText(content, filename, {
        contentType: 'text/plain;charset=utf-8',
        ...options
      })
    } catch (error) {
      console.error('Error downloading document:', error)
      options.onError?.(error as Error)
      throw error
    }
  }
}

export default downloadUtils