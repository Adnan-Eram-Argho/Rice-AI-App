import { motion } from 'framer-motion'
import { BookOpen, Cpu, Database, FileText, Shield, TrendingUp, GitBranch } from 'lucide-react'

const sections = {
  'product': {
    title: 'Product Overview',
    icon: BookOpen,
    content: `
## What It Does

Rice AI Doctor is an offline Progressive Web Application that enables farmers to diagnose rice leaf diseases using their smartphone camera, with no internet connection required after initial download.

### Target Users

1. **Farmers** (Primary): Quick disease identification in fields with treatment recommendations in Bengali
2. **SAU Students**: Interactive learning tool for plant pathology courses
3. **Agriculture Officers**: Field diagnostic aid for extension services

### Core Use Cases

- **Field Diagnosis**: Farmer photographs diseased leaf → AI identifies disease → Shows treatment steps in Bangla
- **Educational Tool**: Students study disease symptoms with bilingual descriptions
- **Preventive Screening**: Regular crop monitoring to catch diseases early
- **Extension Support**: Agriculture officers verify farmer diagnoses remotely
    `
  },
  'tech-stack': {
    title: 'Technology Stack',
    icon: Cpu,
    content: `
## Frontend
- **Framework**: React 19.2.5
- **Build Tool**: Vite 7.0.0
- **Styling**: TailwindCSS 3.4.17
- **Routing**: React Router DOM 6.x
- **Animations**: Framer Motion
- **Icons**: Lucide React

## AI & ML
- **Inference Engine**: ONNX Runtime Web 1.24.3
- **Model Architecture**: EfficientNet-B0 + CBAM Attention
- **Quantization**: Static INT8 (3.2 MB)
- **Training Framework**: TensorFlow 2.15 + Keras 3
- **Accuracy**: 94.06% on 5-class detection

## PWA & Deployment
- **PWA Plugin**: vite-plugin-pwa 1.2.0
- **Hosting**: Vercel (Automatic HTTPS)
- **Service Worker**: Workbox for caching
- **Headers**: COOP/COEP for WASM support

## Development Tools
- **Linting**: ESLint 10.x
- **Package Manager**: npm
- **Version Control**: Git + GitHub
    `
  },
  'data-flow': {
    title: 'Data Flow Diagram',
    icon: GitBranch,
    content: `
## Image Processing Pipeline

\`\`\`
User Capture → Canvas (224x224) → IQA Validation → Contrast Stretching → TTA (4 variations) → ONNX Inference → Weighted Average → Confidence Check → Result Display
\`\`\`

### Step-by-Step Flow

1. **Image Capture**: getUserMedia API or file upload
2. **Canvas Rendering**: Resize to 224x224 pixels
3. **IQA Check**: Center-region brightness/blur validation
4. **Preprocessing**: Per-channel contrast stretching (RAW 0-255 values)
5. **TTA Generation**: Original, H-flip, V-flip, Center crop (75%)
6. **Sequential Inference**: 4 ONNX predictions (prevents WASM NaN issues)
7. **Weighted Averaging**: Center crop gets 1.5x weight
8. **Confidence Threshold**: ≥75% required for confident prediction
9. **Result Mapping**: Class index → Disease name → Bilingual info
10. **Display**: Symptoms + Treatment in selected language
    `
  },
  'api-docs': {
    title: 'API Documentation',
    icon: FileText,
    content: `
## APIs Used

### External APIs
- **None** - 100% offline operation

### Internal Configuration Files

#### crops_config.json
\`\`\`json
{
  "default_crop": "rice",
  "crops": {
    "rice": {
      "name_bn": "ধান",
      "name_en": "Rice",
      "current_metadata_file": "metadata_rice_v4.json",
      "diseases_data_file": "diseases_rice_v1.json"
    }
  }
}
\`\`\`

#### metadata_rice_v4.json
\`\`\`json
{
  "crop_id": "rice",
  "model_version": "v4",
  "model_filename": "rice_model_v4.onnx",
  "input_shape": [1, 224, 224, 3],
  "confidence_threshold": 0.75,
  "classes": {
    "0": "Blast",
    "1": "Brown_Spot",
    "2": "Healthy",
    "3": "Leaf_Scald",
    "4": "Background"
  }
}
\`\`\`

## Authentication Model
- **No authentication required** for public app usage
- **Admin access**: localStorage-based token for /docs/admin panel
- **Future**: JWT-based auth for cloud sync features (V5+)
    `
  },
  'ai-layer': {
    title: 'AI & ML Layer',
    icon: Cpu,
    content: `
## Model Architecture

### Base Model: EfficientNet-B0
- Pretrained on ImageNet (1.2M images, 1000 classes)
- Built-in normalization layer (expects RAW 0-255 input)
- Swish activation (requires ONNX opset 16)
- 5.3M parameters before quantization

### Attention Mechanism: CBAM
**Convolutional Block Attention Module** applies both:
- **Channel Attention**: Weights feature importance
- **Spatial Attention**: Focuses on lesion locations

**Implementation**: Functional API (Keras 3 compatible, no custom objects)

### Loss Function: Focal Loss
\`\`\`python
focal_loss(gamma=2.0, alpha=class_weights)
\`\`\`
- Focuses training on hard-to-classify examples
- Alpha weights compensate for class imbalance
- Manual tuning: Background class alpha reduced from 2.94 → 2.0

### Training Strategy
**Two-Phase Training**:
1. **Phase 1**: Frozen backbone, train CBAM + head (LR=1e-3, 20 epochs)
2. **Phase 2**: Unfreeze last 20 layers, fine-tune (LR=5e-5, 30 epochs)

### Quantization
- **Method**: Static INT8 with calibration data (128 images)
- **Weight Type**: QInt8 (per-channel)
- **Activation Type**: QUInt8
- **Size Reduction**: 17 MB (FP32) → 3.2 MB (INT8)
- **Accuracy Impact**: <0.5% drop (94.06% → ~93.8%)

### Test-Time Augmentation (TTA)
4 sequential inferences with weighted averaging:
1. Original (weight: 1.0)
2. Horizontal Flip (weight: 1.0)
3. Vertical Flip (weight: 1.0)
4. Center Crop 75% (weight: 1.5) ← Strips background noise

**Total Time**: ~480-530ms (sequential to prevent WASM NaN issues)
    `
  },
  'performance': {
    title: 'Performance & Scalability',
    icon: TrendingUp,
    content: `
## Current Performance Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Model Load Time (3G) | <10s | 8-10s | ✅ Pass |
| Inference Time | <550ms | 480-530ms | ✅ Pass |
| RAM Usage | <30 MB | 15-20 MB | ✅ Pass |
| Accuracy | >93% | 94.06% | ✅ Pass |
| Bundle Size | <1 MB | ~500 KB | ✅ Pass |

## Optimization Strategies

### Model Optimization
- **INT8 Quantization**: 5x size reduction vs FP32
- **EfficientNet-B0**: Best accuracy/size tradeoff for mobile
- **Single-thread WASM**: Stability over speed on low-end devices

### Caching Strategy
- **Service Worker**: CacheFirst strategy for ONNX/WASM files
- **Cache Limit**: 30 MB (accommodates model + assets)
- **Auto-cleanup**: Removes old model versions on filename change

### Runtime Optimization
- **SIMD Enabled**: Faster tensor operations
- **Lazy Loading**: Components loaded on-demand
- **Contrast Stretching**: Improves confidence without retraining

## Scalability Plan

### Horizontal Scaling
- **CDN Distribution**: Vercel Edge Network serves static assets globally
- **Browser Caching**: Model cached indefinitely after first download
- **Zero Backend**: No server scaling concerns

### Vertical Scaling
- **Model Expansion**: Add crops via JSON config (no code changes)
- **Class Addition**: Retrain with new diseases, export new ONNX model
- **Language Support**: Add translations to diseases_*.json files

### Future Optimizations (V5+)
- **WebGPU Backend**: 10x faster inference when widely supported
- **Dynamic Quantization**: Runtime precision adjustment based on device
- **Model Splitting**: Load only relevant crop models on-demand
    `
  },
  'security': {
    title: 'Security & Privacy',
    icon: Shield,
    content: `
## Security Architecture

### Data Privacy
- **No Data Collection**: All processing happens client-side
- **No Image Upload**: Photos never leave user's device
- **No Tracking**: No analytics or telemetry in current version
- **GDPR Compliant**: Zero personal data processed

### Authentication
- **Public Access**: App freely accessible without login
- **Admin Panel**: localStorage-based token (simple demo implementation)
- **Future**: JWT-based auth for cloud features (V5+)

### Content Security
- **HTTPS Required**: Vercel enforces SSL/TLS
- **CORS Headers**: COOP/COEP for WASM SharedArrayBuffer
- **No Third-party Scripts**: All dependencies bundled locally

### Model Security
- **Static Models**: ONNX files served from CDN, not dynamically generated
- **No Model Updates**: Version controlled via filename changes
- **Integrity**: Browser cache ensures consistent model delivery

## Vulnerability Mitigation

### XSS Prevention
- **React JSX**: Automatic escaping of user inputs
- **No eval()**: No dynamic code execution
- **Sanitized Configs**: JSON files validated at build time

### CSRF Protection
- **Stateless Design**: No session cookies to hijack
- **No Forms**: Camera capture uses MediaDevices API

### Supply Chain Security
- **Locked Dependencies**: package-lock.json ensures reproducible builds
- **Minimal Dependencies**: Only essential packages used
- **Regular Audits**: npm audit run before each release

## Future Security Enhancements (V5+)
- **End-to-end Encryption**: For cloud-synced scan history
- **Rate Limiting**: Prevent API abuse when backend added
- **Input Validation**: Stricter image format/size checks
- **Audit Logging**: Track admin actions on /docs panel
    `
  }
}

export default function TechnicalDocs({ section }) {
  const data = sections[section]
  if (!data) return null

  const Icon = data.icon

  // Improved markdown renderer with proper formatting
  const renderMarkdown = (text) => {
    const lines = text.split('\n')
    const elements = []
    let inCodeBlock = false
    let codeContent = []
    
    lines.forEach((line, idx) => {
      // Handle code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          elements.push(
            <pre key={`code-${idx}`} className="bg-slate-900 text-slate-100 p-6 rounded-xl overflow-x-auto my-6 text-sm font-mono">
              <code>{codeContent.join('\n')}</code>
            </pre>
          )
          codeContent = []
          inCodeBlock = false
        } else {
          // Start code block
          inCodeBlock = true
        }
        return
      }
      
      if (inCodeBlock) {
        codeContent.push(line)
        return
      }
      
      // Handle headings
      if (line.startsWith('## ')) {
        elements.push(<h2 key={idx} className="text-3xl font-bold text-slate-900 mt-10 mb-5 pb-2 border-b-2 border-slate-200">{line.replace('## ', '')}</h2>)
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={idx} className="text-2xl font-semibold text-slate-900 mt-8 mb-4">{line.replace('### ', '')}</h3>)
      } else if (line.startsWith('#### ')) {
        elements.push(<h4 key={idx} className="text-xl font-medium text-slate-900 mt-6 mb-3">{line.replace('#### ', '')}</h4>)
      } 
      // Handle bullet points with bold text
      else if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.+?)\*\*: (.+)/)
        if (match) {
          elements.push(
            <li key={idx} className="ml-6 mb-3 text-lg text-slate-800 list-disc">
              <span className="font-bold text-slate-900">{match[1]}:</span> {renderInlineFormatting(match[2])}
            </li>
          )
        } else {
          // Fallback for bullet points without colon format
          elements.push(
            <li key={idx} className="ml-6 mb-3 text-lg text-slate-800 list-disc">
              {renderInlineFormatting(line.replace('- ', ''))}
            </li>
          )
        }
      }
      // Handle numbered lists
      else if (/^\d+\.\s/.test(line)) {
        const content = line.replace(/^\d+\.\s/, '')
        elements.push(
          <li key={idx} className="ml-6 mb-3 text-lg text-slate-800 list-decimal">
            {renderInlineFormatting(content)}
          </li>
        )
      }
      // Handle tables (skip for now)
      else if (line.startsWith('|')) {
        // Skip table rendering
      }
      // Handle empty lines
      else if (!line.trim()) {
        // Skip empty lines
      }
      // Regular paragraphs
      else {
        elements.push(<p key={idx} className="mb-4 text-lg text-slate-800 leading-relaxed">{renderInlineFormatting(line)}</p>)
      }
    })
    
    return elements
  }
  
  // Helper function to render inline formatting (bold, italic, code)
  const renderInlineFormatting = (text) => {
    // Handle inline code
    const parts = text.split(/(`[^`]+`)/g)
    
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        // Inline code
        return <code key={i} className="bg-slate-100 px-2 py-1 rounded text-sm font-mono text-slate-900">{part.slice(1, -1)}</code>
      }
      
      // Handle bold text within the part
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g)
      
      return boldParts.map((boldPart, j) => {
        if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
          return <strong key={`${i}-${j}`} className="font-bold text-slate-900">{boldPart.slice(2, -2)}</strong>
        }
        return boldPart
      })
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-8 md:p-10">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
          <Icon className="w-7 h-7 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">{data.title}</h2>
      </div>
      
      <div className="prose prose-slate max-w-none">
        {renderMarkdown(data.content)}
      </div>
    </div>
  )
}
