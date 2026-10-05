/* ==========================================================================
   Local Storage Management & State Sync
   ========================================================================== */

const STORAGE_KEY = 'DICE_CLASS_DATA_V1';

const Storage = {
  // Load data or initialize with defaults
  getData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
    }
    return this.resetToDefaults();
  },

  // Save current state
  saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
  },

  // Reset to initial mock data
  resetToDefaults() {
    const defaultData = {
      currentMode: 'student', // 'student' or 'teacher'
      selectedStudentId: 1,
      currencyName: '골드',
      students: JSON.parse(JSON.stringify(INITIAL_STUDENTS)),
      jobs: JSON.parse(JSON.stringify(INITIAL_JOBS)),
      products: JSON.parse(JSON.stringify(INITIAL_PRODUCTS)),
      missions: JSON.parse(JSON.stringify(INITIAL_MISSIONS)),
      coupons: [
        // default sample purchased coupon for Student #1
        {
          id: 'c_init_1',
          studentId: 1,
          productId: 'prod_5',
          name: '아침 자율음악 1곡 신청권',
          icon: '🎵',
          purchasedAt: new Date().toLocaleDateString('ko-KR'),
          used: false
        }
      ],
      transactions: [
        {
          id: 'tx_init_1',
          studentId: 1,
          studentName: '강민준',
          type: 'deposit', // 'deposit' or 'withdraw'
          amount: 15,
          reason: '1인 1역 성실 수행 보상',
          date: new Date().toLocaleDateString('ko-KR')
        }
      ]
    };
    this.saveData(defaultData);
    return defaultData;
  }
};
