/* ==========================================================================
   Initial Mock Data for 6th Grade Classroom
   - 25 Students
   - Classroom Jobs (1인 1역)
   - Store Products & Coupons
   - Daily Classroom Quests
   ========================================================================== */

const INITIAL_JOBS = [
  { id: 'job_1', title: '칠판 지우개 관리관', desc: '쉬는 시간 및 수업 종료 후 칠판을 깨끗이 지우고 분필 가루를 털어냅니다.', wage: 10, icon: '🧹' },
  { id: 'job_2', title: '우유 급식 당번', desc: '아침 우유 배급함에서 우유를 반으로 가져오고, 마신 팩을 납작하게 분리 배출합니다.', wage: 15, icon: '🥛' },
  { id: 'job_3', title: '스마트 기기 충전관', desc: '수업에 사용한 태블릿 PC를 수거하여 충전함에 꽂고 정리합니다.', wage: 15, icon: '💻' },
  { id: 'job_4', title: '학급 도서관 사서', desc: '학급문고 책꽂이를 깔끔하게 정돈하고 대출/반납 명부를 확인합니다.', wage: 10, icon: '📚' },
  { id: 'job_5', title: '초록 화분 지킴이', desc: '창가의 학급 화분에 주기적으로 물을 주고 시든 잎을 정돈합니다.', wage: 10, icon: '🌱' },
  { id: 'job_6', title: '분리수거 환경부장', desc: '종이, 플라스틱, 캔 분리수거함이 올바르게 분류되었는지 점검합니다.', wage: 15, icon: '♻️' },
  { id: 'job_7', title: '에너지 절약 보안관', desc: '이동 수업 및 하교 시 전등과 냉난방기 전원을 끕니다.', wage: 10, icon: '💡' },
  { id: 'job_8', title: '체육 기구 관리관', desc: '체육 시간 공과 줄넘기를 챙겨오고 수업 후 수납장에 정리합니다.', wage: 15, icon: '⚽' },
  { id: 'job_9', title: '창문 환기 요원', desc: '아침 등교 후 및 점심시간에 창문을 열어 쾌적하게 환기합니다.', wage: 10, icon: '🪟' },
  { id: 'job_10', title: '학급 알림 전달관', desc: '선생님의 안내사항 및 가정통신문을 학생들에게 전달합니다.', wage: 10, icon: '📢' },
  { id: 'job_11', title: '자리 정돈 점검관', desc: '하교 전 책상 서랍과 바닥 쓰레기가 없는지 살펴봅니다.', wage: 10, icon: '✨' },
  { id: 'job_12', title: '시간 알리미', desc: '수업 시작 1분 전 수업 준비를 반 친구들에게 안내합니다.', wage: 10, icon: '⏰' }
];

const INITIAL_STUDENTS = [
  { id: 1, name: '강민준', balance: 120, totalExp: 240, jobId: 'job_1', jobCompleted: true, avatar: '👦' },
  { id: 2, name: '고은우', balance: 85, totalExp: 150, jobId: 'job_2', jobCompleted: false, avatar: '👧' },
  { id: 3, name: '김도윤', balance: 210, totalExp: 420, jobId: 'job_3', jobCompleted: true, avatar: '👦' },
  { id: 4, name: '김서아', balance: 140, totalExp: 280, jobId: 'job_4', jobCompleted: false, avatar: '👧' },
  { id: 5, name: '김시우', balance: 95, totalExp: 190, jobId: 'job_5', jobCompleted: true, avatar: '👦' },
  { id: 6, name: '문지호', balance: 160, totalExp: 310, jobId: 'job_6', jobCompleted: false, avatar: '👦' },
  { id: 7, name: '박서준', balance: 230, totalExp: 460, jobId: 'job_7', jobCompleted: true, avatar: '👦' },
  { id: 8, name: '박예은', balance: 110, totalExp: 220, jobId: 'job_8', jobCompleted: false, avatar: '👧' },
  { id: 9, name: '배하윤', balance: 75, totalExp: 130, jobId: 'job_9', jobCompleted: true, avatar: '👧' },
  { id: 10, name: '서예준', balance: 190, totalExp: 380, jobId: 'job_10', jobCompleted: true, avatar: '👦' },
  { id: 11, name: '성지안', balance: 130, totalExp: 260, jobId: 'job_11', jobCompleted: false, avatar: '👧' },
  { id: 12, name: '손유준', balance: 175, totalExp: 350, jobId: 'job_12', jobCompleted: true, avatar: '👦' },
  { id: 13, name: '신수아', balance: 90, totalExp: 170, jobId: 'job_1', jobCompleted: false, avatar: '👧' },
  { id: 14, name: '안다은', balance: 220, totalExp: 430, jobId: 'job_2', jobCompleted: true, avatar: '👧' },
  { id: 15, name: '양우진', balance: 105, totalExp: 210, jobId: 'job_3', jobCompleted: false, avatar: '👦' },
  { id: 16, name: '오은채', balance: 165, totalExp: 330, jobId: 'job_4', jobCompleted: true, avatar: '👧' },
  { id: 17, name: '유하준', balance: 80, totalExp: 140, jobId: 'job_5', jobCompleted: false, avatar: '👦' },
  { id: 18, name: '윤채원', balance: 260, totalExp: 510, jobId: 'job_6', jobCompleted: true, avatar: '👧' },
  { id: 19, name: '이건우', balance: 145, totalExp: 290, jobId: 'job_7', jobCompleted: false, avatar: '👦' },
  { id: 20, name: '이소율', balance: 195, totalExp: 390, jobId: 'job_8', jobCompleted: true, avatar: '👧' },
  { id: 21, name: '이주원', balance: 115, totalExp: 230, jobId: 'job_9', jobCompleted: false, avatar: '👦' },
  { id: 22, name: '정지우', balance: 150, totalExp: 300, jobId: 'job_10', jobCompleted: true, avatar: '👧' },
  { id: 23, name: '조현우', balance: 65, totalExp: 110, jobId: 'job_11', jobCompleted: false, avatar: '👦' },
  { id: 24, name: '최지아', balance: 240, totalExp: 470, jobId: 'job_12', jobCompleted: true, avatar: '👧' },
  { id: 25, name: '한태양', balance: 180, totalExp: 360, jobId: 'job_1', jobCompleted: true, avatar: '👦' }
];

const INITIAL_PRODUCTS = [
  { id: 'prod_1', name: '원하는 짝꿍/자리 선택권', category: 'coupon', price: 150, stock: 5, icon: '🪑', desc: '다음 자리 바꾸기 때 원하는 자리를 우선 지정할 수 있는 황금 티켓' },
  { id: 'prod_2', name: '오늘 하루 청소 면제권', category: 'coupon', price: 80, stock: 8, icon: '🧹', desc: '담당 청소 구역 청소를 하루 쉬어갈 수 있는 쿠폰' },
  { id: 'prod_3', name: '선생님 간식 박스 뽑기권', category: 'item', price: 50, stock: 15, icon: '🎁', desc: '교탁 간식 바구니에서 맛있는 간식을 1개 고를 수 있는 기회' },
  { id: 'prod_4', name: '급식 1등 줄서기권', category: 'coupon', price: 70, stock: 6, icon: '🍱', desc: '점심시간에 가장 먼저 급식실 줄을 설 수 있는 특권' },
  { id: 'prod_5', name: '아침 자율음악 1곡 신청권', category: 'coupon', price: 40, stock: 10, icon: '🎵', desc: '아침 활동 시간에 내가 좋아하는 음악을 반 전체에 방송' },
  { id: 'prod_6', name: '숙제 1회 면제권 (일기/학습지)', category: 'coupon', price: 200, stock: 3, icon: '📝', desc: '가장 아끼는 일기 또는 학습지 숙제를 1회 당당히 면제받는 권리' }
];

const INITIAL_MISSIONS = [
  { id: 'mission_1', title: '아침 독서 15분 몰입하기', reward: 5, tag: '자율활동' },
  { id: 'mission_2', title: '친구에게 따뜻한 칭찬 한마디 건네기', reward: 5, tag: '인성' },
  { id: 'mission_3', title: '모둠 협동 학습 적극 참여하기', reward: 10, tag: '수업태도' }
];

// Level Calculations: Lv.1 (0~99), Lv.2 (100~249), Lv.3 (250~449), Lv.4 (450~699), Lv.5 (700~999), Lv.6 (1000+)
const LEVEL_TIERS = [
  { level: 1, minExp: 0, maxExp: 100, title: '성실한 새싹' },
  { level: 2, minExp: 100, maxExp: 250, title: '도전하는 탐험가' },
  { level: 3, minExp: 250, maxExp: 450, title: '책임감 넘치는 시민' },
  { level: 4, minExp: 450, maxExp: 700, title: '지혜로운 리더' },
  { level: 5, minExp: 700, maxExp: 1000, title: '명예로운 학급 마스터' },
  { level: 6, minExp: 1000, maxExp: 9999, title: '전설의 다이스 영웅' }
];

function getLevelInfo(totalExp) {
  let tier = LEVEL_TIERS[0];
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (totalExp >= LEVEL_TIERS[i].minExp) {
      tier = LEVEL_TIERS[i];
      break;
    }
  }

  const range = tier.maxExp - tier.minExp;
  const currentInTier = totalExp - tier.minExp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentInTier / range) * 100)));
  const nextExpNeeded = Math.max(0, tier.maxExp - totalExp);

  return {
    level: tier.level,
    title: tier.title,
    minExp: tier.minExp,
    maxExp: tier.maxExp,
    progressPercent: progressPercent,
    nextExpNeeded: nextExpNeeded
  };
}
