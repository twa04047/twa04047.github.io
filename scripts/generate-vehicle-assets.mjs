import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../public/media/vehicle/', import.meta.url));
await mkdir(output, { recursive: true });
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const text = (x, y, value, size = 20, fill = '#193f33', extra = '') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${escape(value)}</text>`;
const svg = (w, h, title, content) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title"><title id="title">${escape(title)}</title><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10" fill="none" stroke="#54836b" stroke-width="1.5"/></marker></defs><rect width="${w}" height="${h}" rx="12" fill="#edf2ec"/><g font-family="Segoe UI, Malgun Gothic, Arial, sans-serif">${content}</g></svg>`;
const arrow = d => `<path d="${d}" fill="none" stroke="#54836b" stroke-width="2" marker-end="url(#arrow)"/>`;
const node = (x, y, w, number, title, detail, dark = false) => `<rect x="${x}" y="${y}" width="${w}" height="94" rx="8" fill="${dark ? '#194b3b' : '#ffffff'}" stroke="${dark ? '#194b3b' : '#c6d5c9'}"/>${text(x+18,y+29,number,13,dark?'#d0ef9d':'#60816b','letter-spacing="1.2"')}${text(x+18,y+57,title,22,dark?'#ffffff':'#193f33','font-weight="600"')}${text(x+18,y+80,detail,15,dark?'#d4e2d7':'#5c7163')}`;

for (const lang of ['ko', 'en']) {
  const ko = lang === 'ko';
  const steps = ko ? [
    ['원천 파싱·익명 ID 매핑', '고정 길이 TXT → CSV / Parquet'],
    ['트립별 운전습관 피처', '속도 차분 · 방향각 · RPM · 브레이크'],
    ['차량별 집계와 보정', '거리·시간 비율화 · 표준화 · 이상치 처리'],
    ['사고 이력 결합', '익명 차량 ID로 운행·보험정보 연결'],
    ['사고 / 무사고 집단 비교', '사고회수로 구분 → F검정 · T-Test'],
    ['분석 결과 자동 생성', 'Excel · CSV · 피처 분포 그래프']
  ] : [
    ['Parse and anonymize', 'Fixed-width TXT → CSV / Parquet'],
    ['Compute trip features', 'Speed changes · direction · RPM · brake'],
    ['Aggregate by vehicle', 'Exposure ratios · scaling · outlier handling'],
    ['Join accident history', 'Match driving and insurance by anonymous ID'],
    ['Compare accident groups', 'Accident count → F-test and T-test'],
    ['Generate analysis outputs', 'Excel · CSV · feature distribution charts']
  ];
  const title = ko ? 'UBI 데이터 처리의 전체 흐름' : 'The UBI data processing workflow';
  let desktop = text(32, 43, 'UBI / DATA PROCESSING',15,'#547460','letter-spacing="2"');
  desktop += text(32,84,title,30,'#193f33','font-weight="600"');
  desktop += `<rect x="32" y="113" width="470" height="54" rx="7" fill="#dce9d2"/>`;
  desktop += text(52,147,ko?'DTG 운행 기록 · 약 1초 간격':'DTG driving records · approximately 1 Hz',20);
  steps.forEach(([heading, detail], i) => {
    const y = 204 + i*130;
    desktop += arrow(`M267 ${i ? y-36 : 167} V${y-8}`);
    desktop += node(32,y,470,String(i+1).padStart(2,'0'),heading,detail,i===5);
  });
  desktop += `<rect x="551" y="462" width="237" height="117" rx="8" fill="#e0e9f1" stroke="#bdccda"/>`;
  desktop += text(571,492,'SECOND INPUT',12,'#496678','letter-spacing="1.3"');
  desktop += text(571,525,ko?'보험 사고 이력':'Insurance history',22,'#2f5063','font-weight="600"');
  desktop += text(571,552,ko?'Excel 정제 · 사고회수 집계':'Excel cleanup · accident counts',14,'#496678');
  desktop += arrow('M668 579 V641 H510');
  desktop += text(551,696,ko?'사고회수 = 0 → 무사고':'Accident count = 0 → no accident',14);
  desktop += text(551,723,ko?'사고회수 ≥ 1 → 사고':'Accident count ≥ 1 → accident',14);
  desktop += text(32,995,ko?'식별자 매핑은 내부에서만 사용합니다. 실제 레코드는 공개하지 않습니다.':'Identifiers stay internal. No source records are published.',15,'#5c7163');
  await writeFile(`${output}/process-${lang}.svg`,svg(820,1024,title,desktop));

  let mobile = text(22,34,'UBI / DATA PROCESSING',13,'#547460','letter-spacing="1.4"');
  mobile += text(22,69,ko?'초 단위 기록에서 집단 비교까지':'From records to group comparison',ko?24:22,'#193f33','font-weight="600"');
  mobile += `<rect x="22" y="94" width="396" height="47" rx="7" fill="#dce9d2"/>${text(40,124,ko?'DTG 운행 기록 · 약 1초 간격':'DTG driving records · approx. 1 Hz',18)}`;
  let prevBottom=141;
  steps.forEach(([heading, detail],i)=>{
    const y=174+i*133+(i>=3?117:0);
    if(i===3){
      mobile += arrow(`M220 ${prevBottom} V${y-114} H12 V${y+47} H20`);
      mobile += `<rect x="42" y="${y-97}" width="356" height="63" rx="6" fill="#e0e9f1" stroke="#bdccda"/>${text(59,y-70,ko?'보험 사고 이력 결합 준비':'Prepare insurance history',18,'#2f5063','font-weight="600"')}${text(59,y-47,ko?'Excel 정제 · 사고회수 · 익명 ID':'Excel cleanup · accident counts · anonymous ID',ko?15:14,'#496678')}`;
      mobile += arrow(`M220 ${y-34} V${y-8}`);
    } else mobile += arrow(`M220 ${prevBottom} V${y-8}`);
    mobile += node(22,y,396,String(i+1).padStart(2,'0'),heading,detail,i===5);
    prevBottom=y+94;
  });
  mobile += text(22,1086,ko?'사고회수 0: 무사고 / 1 이상: 사고':'Accident count: 0 = none / ≥ 1 = accident',16,'#5c7163');
  await writeFile(`${output}/process-${lang}-mobile.svg`,svg(440,1115,title,mobile));
}

let cover = `<rect width="1200" height="500" fill="#143b32"/><path d="M560 0V500M860 0V500M0 250H1200" stroke="#cde1c2" stroke-opacity=".09"/>`;
cover += text(56,62,'UBI / VEHICLE DATA ENGINEERING',20,'#bfd99c','letter-spacing="2.4"');
cover += text(50,275,'11×',180,'#d0ef9d','font-weight="600" letter-spacing="-12"');
cover += text(60,340,'FASTER PROCESSING',25,'#ffffff','letter-spacing="2"');
cover += text(60,440,'EXCEL → PYTHON · ROW LOOPS → PANDAS',17,'#c4d6ca','letter-spacing="1.2"');
for(const [i,label,sub] of [[0,'01   SECOND-BY-SECOND','Driving records'],[1,'02   PANDAS PIPELINE','Features · aggregation · insurance'],[2,'03   VEHICLE INSIGHTS','Accident / no-accident comparison']]){
  const y=110+i*112;
  cover += `<rect x="640" y="${y}" width="500" height="88" rx="6" fill="${i===1?'#d0ef9d':'#204e3f'}"/>`;
  cover += text(664,y+34,label,21,i===1?'#193f33':'#eff6eb','font-weight="600"');
  cover += text(664,y+62,sub,17,i===1?'#365442':'#c4d6ca');
  if(i<2) cover += `<path d="M890 ${y+91}v16m-5-5 5 5 5-5" fill="none" stroke="#9db998" stroke-width="2"/>`;
}
await writeFile(`${output}/overview.svg`,svg(1200,500,'UBI vehicle data: 11 times faster processing with pandas',cover));
console.log('Generated bilingual UBI workflow diagrams and cover.');
