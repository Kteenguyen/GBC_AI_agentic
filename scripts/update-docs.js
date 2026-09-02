const fs = require('fs');
const path = require('path');

const guidesDir = path.join(process.cwd(), 'docs', 'guides');
const docsDataPath = path.join(process.cwd(), 'src', 'lib', 'docsData.ts');
const guideFiles = fs.readdirSync(guidesDir).filter(f => f.endsWith('.md')).sort();

const categoryMapping = {
  '00': { category: 'Kiến Trúc & Đội Ngũ', categoryKey: 'architecture', readTime: '10 phút' },
  '01': { category: 'Git & Quản Lý Mã Nguồn', categoryKey: 'git', readTime: '6 phút' },
  '02': { category: 'CI / CD Tự Động Hóa', categoryKey: 'ci', readTime: '8 phút' },
  '03': { category: 'Bảo Mật & Quét Lỗ Hổng', categoryKey: 'security', readTime: '7 phút' },
  '04': { category: 'Chất Lượng Mã Nguồn', categoryKey: 'quality', readTime: '7 phút' },
  '05': { category: 'Bảo Mật & Quét Lỗ Hổng', categoryKey: 'security', readTime: '6 phút' },
  '06': { category: 'Đóng Gói Container', categoryKey: 'docker', readTime: '7 phút' },
  '07': { category: 'Kubernetes & GitOps', categoryKey: 'k8s', readTime: '9 phút' },
  '08': { category: 'Giám Sát & Cảnh Báo', categoryKey: 'monitoring', readTime: '8 phút' }
};

const allDocs = guideFiles.map((filename, idx) => {
  const content = fs.readFileSync(path.join(guidesDir, filename), 'utf-8');
  const num = filename.substring(0, 2);
  const meta = categoryMapping[num] || { category: 'Chung', categoryKey: 'general', readTime: '5 phút' };
  
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : filename;
  
  return {
    id: filename.replace('.md', ''),
    order: idx,
    filename: filename,
    title: title,
    category: meta.category,
    categoryKey: meta.categoryKey,
    readTime: meta.readTime,
    summary: 'Tài liệu hướng dẫn kỹ thuật: ' + title,
    tags: [meta.category, 'DevOps', 'Workflow', 'Pipeline'],
    content: content,
    updatedAt: '2026-09-02'
  };
});

const tsCode = `// Complete Bundled Technical Documentation Guides (100% Serverless & Offline Ready)

export interface TechnicalDocGuideItem {
  id: string;
  order: number;
  filename: string;
  title: string;
  category: string;
  categoryKey: string;
  readTime?: string;
  summary: string;
  description?: string;
  tags?: string[];
  content: string;
  updatedAt?: string;
}

export type TechnicalDoc = TechnicalDocGuideItem;

export const DOC_CATEGORIES = [
  { key: 'all', name: 'Tất Cả Danh Mục', label: 'Tất Cả Danh Mục' },
  { key: 'architecture', name: 'Kiến Trúc & Đội Ngũ', label: 'Kiến Trúc & Đội Ngũ' },
  { key: 'git', name: 'Git & Quản Lý Mã Nguồn', label: 'Git & Quản Lý Mã Nguồn' },
  { key: 'ci', name: 'CI / CD Tự Động Hóa', label: 'CI / CD Tự Động Hóa' },
  { key: 'security', name: 'Bảo Mật & Quét Lỗ Hổng', label: 'Bảo Mật & Quét Lỗ Hổng' },
  { key: 'quality', name: 'Chất Lượng Mã Nguồn', label: 'Chất Lượng Mã Nguồn' },
  { key: 'docker', name: 'Đóng Gói Container', label: 'Đóng Gói Container' },
  { key: 'k8s', name: 'Kubernetes & GitOps', label: 'Kubernetes & GitOps' },
  { key: 'monitoring', name: 'Giám Sát & Cảnh Báo', label: 'Giám Sát & Cảnh Báo' }
];

export const BUNDLED_TECHNICAL_DOCS: TechnicalDocGuideItem[] = ${JSON.stringify(allDocs, null, 2)};
`;

fs.writeFileSync(docsDataPath, tsCode, 'utf-8');
console.log('Successfully updated docsData.ts with both name and label in DOC_CATEGORIES!');
