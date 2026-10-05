/* ==========================================================================
   Main Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize state from LocalStorage
  let appState = Storage.getData();

  // Active view filters
  let teacherSubTab = 'students';
  let studentSearchQuery = '';

  // DOM Elements
  const btnTeacherMode = document.getElementById('btnTeacherMode');
  const btnStudentMode = document.getElementById('btnStudentMode');
  const studentSelectWrap = document.getElementById('studentSelectWrap');
  const studentSelectDropdown = document.getElementById('studentSelectDropdown');
  const teacherView = document.getElementById('teacherView');
  const studentView = document.getElementById('studentView');

  const btnSoundToggle = document.getElementById('btnSoundToggle');
  const btnDataReset = document.getElementById('btnDataReset');

  // Modals
  const currencyModal = document.getElementById('currencyModal');
  const bulkPayModal = document.getElementById('bulkPayModal');
  const addProductModal = document.getElementById('addProductModal');
  const useCouponModal = document.getElementById('useCouponModal');

  // Toast container
  const toastContainer = document.getElementById('toastContainer');

  // Active target student for currency modal
  let activeModalStudentId = null;
  let activeCouponIdToUse = null;

  /* ========================================================================
     TOAST NOTIFICATIONS
     ======================================================================== */
  function showToast(message, icon = '✨') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  /* ========================================================================
     MODE & STUDENT SWITCHING
     ======================================================================== */
  function populateStudentDropdown() {
    studentSelectDropdown.innerHTML = '';
    appState.students.forEach(st => {
      const opt = document.createElement('option');
      opt.value = st.id;
      opt.textContent = `${st.id}번 ${st.name}`;
      if (st.id === appState.selectedStudentId) {
        opt.selected = true;
      }
      studentSelectDropdown.appendChild(opt);
    });
  }

  function setMode(mode) {
    appState.currentMode = mode;
    Storage.saveData(appState);

    SoundFX.playClick();

    if (mode === 'teacher') {
      btnTeacherMode.classList.add('active');
      btnStudentMode.classList.remove('active');
      studentSelectWrap.style.display = 'none';
      teacherView.style.display = 'block';
      studentView.style.display = 'none';
      renderTeacherView();
    } else {
      btnTeacherMode.classList.remove('active');
      btnStudentMode.classList.add('active');
      studentSelectWrap.style.display = 'flex';
      teacherView.style.display = 'none';
      studentView.style.display = 'block';
      renderStudentView();
    }
  }

  /* ========================================================================
     STUDENT VIEW RENDER
     ======================================================================== */
  function renderStudentView() {
    const student = appState.students.find(s => s.id === appState.selectedStudentId) || appState.students[0];
    const levelInfo = getLevelInfo(student.totalExp);
    const assignedJob = appState.jobs.find(j => j.id === student.jobId) || {
      title: '미배정',
      desc: '선생님께서 아직 역할을 배정하지 않았습니다.',
      wage: 0,
      icon: '🌱'
    };

    // 1. Identity & Wallet Banner
    document.getElementById('stAvatar').textContent = student.avatar || '👦';
    document.getElementById('stName').textContent = `${student.id}번 ${student.name}`;
    document.getElementById('stLevelBadge').textContent = `Lv.${levelInfo.level} ${levelInfo.title}`;
    document.getElementById('stBalance').textContent = student.balance.toLocaleString();
    document.getElementById('stCurrencyUnit').textContent = appState.currencyName;

    // 2. Level & EXP Gauge
    document.getElementById('stExpValues').textContent = `${student.totalExp} / ${levelInfo.maxExp} XP`;
    document.getElementById('stExpProgressFill').style.width = `${levelInfo.progressPercent}%`;
    document.getElementById('stExpNextNeeded').textContent = levelInfo.nextExpNeeded > 0
      ? `다음 레벨까지 ${levelInfo.nextExpNeeded} XP 남음`
      : '최고 레벨 도달!';

    // 3. Today's 1-Person 1-Role
    document.getElementById('stJobIcon').textContent = assignedJob.icon;
    document.getElementById('stJobTitle').textContent = assignedJob.title;
    document.getElementById('stJobWage').textContent = `일급 +${assignedJob.wage} ${appState.currencyName}`;
    document.getElementById('stJobDesc').textContent = assignedJob.desc;

    const jobStatusContainer = document.getElementById('stJobStatusContainer');
    const btnCompleteJob = document.getElementById('btnCompleteJob');

    if (student.jobCompleted) {
      jobStatusContainer.innerHTML = `
        <span class="job-status-pill completed">
          <span>✓</span> 오늘 역할 수행 완료
        </span>
      `;
      btnCompleteJob.style.display = 'none';
    } else {
      jobStatusContainer.innerHTML = `
        <span class="job-status-pill pending">
          <span>⏳</span> 오늘 수행 전
        </span>
      `;
      btnCompleteJob.style.display = 'inline-flex';
    }

    // 4. Daily Missions List
    const missionListContainer = document.getElementById('stMissionList');
    missionListContainer.innerHTML = '';
    appState.missions.forEach((m, idx) => {
      const item = document.createElement('div');
      item.className = 'mission-item-card';
      item.innerHTML = `
        <div class="mission-content">
          <div class="mission-bullet">${idx + 1}</div>
          <div>
            <div class="mission-title">${m.title}</div>
            <div class="mission-meta">${m.tag} • 보상 +${m.reward} ${appState.currencyName}</div>
          </div>
        </div>
        <span class="brand-badge">학급 퀘스트</span>
      `;
      missionListContainer.appendChild(item);
    });

    // 5. Store Products
    const storeContainer = document.getElementById('stStoreGrid');
    storeContainer.innerHTML = '';
    appState.products.forEach(p => {
      const canAfford = student.balance >= p.price;
      const isOutOfStock = p.stock <= 0;

      const pCard = document.createElement('div');
      pCard.className = 'product-card';
      pCard.innerHTML = `
        <div>
          <div class="product-top">
            <div class="product-icon">${p.icon}</div>
            <div class="product-info">
              <h5>${p.name}</h5>
              <p>${p.desc}</p>
            </div>
          </div>
        </div>
        <div class="product-bottom">
          <div>
            <div class="product-price">${p.price} ${appState.currencyName}</div>
            <div class="product-stock">남은 수량: ${p.stock}개</div>
          </div>
          <button class="btn btn-sm btn-cta-orange btn-buy-product" 
                  data-product-id="${p.id}" 
                  ${(!canAfford || isOutOfStock) ? 'disabled style="opacity:0.4; cursor:not-allowed; box-shadow:none;"' : ''}>
            ${isOutOfStock ? '품절' : (canAfford ? '구매하기' : '잔액 부족')}
          </button>
        </div>
      `;
      storeContainer.appendChild(pCard);
    });

    // Bind buy button events
    storeContainer.querySelectorAll('.btn-buy-product').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const prodId = e.currentTarget.getAttribute('data-product-id');
        handleStudentBuyProduct(student.id, prodId);
      });
    });

    // 6. My Inventory (Coupons)
    renderStudentInventory(student.id);
  }

  function renderStudentInventory(studentId) {
    const inventoryContainer = document.getElementById('stInventoryList');
    const myCoupons = (appState.coupons || []).filter(c => c.studentId === studentId);

    if (myCoupons.length === 0) {
      inventoryContainer.innerHTML = `
        <div class="empty-box">
          <div class="empty-box-icon">🎒</div>
          <div class="empty-box-text">보관 중인 쿠폰이나 아이템이 없습니다.<br>상점에서 필요한 물품을 구매해 보세요!</div>
        </div>
      `;
      return;
    }

    inventoryContainer.innerHTML = '';
    myCoupons.forEach(cp => {
      const cpItem = document.createElement('div');
      cpItem.className = `inventory-item ${cp.used ? 'used' : ''}`;
      cpItem.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 24px;">${cp.icon}</div>
          <div class="coupon-details">
            <h5>${cp.name}</h5>
            <p>구매일: ${cp.purchasedAt} ${cp.used ? '• <strong style="color:var(--text-muted);">(사용 완료)</strong>' : ''}</p>
          </div>
        </div>
        <div>
          ${cp.used
            ? '<span class="job-status-pill completed">사용됨</span>'
            : `<button class="btn btn-sm btn-cta-orange btn-use-coupon" data-coupon-id="${cp.id}">사용하기</button>`
          }
        </div>
      `;
      inventoryContainer.appendChild(cpItem);
    });

    inventoryContainer.querySelectorAll('.btn-use-coupon').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cpId = e.currentTarget.getAttribute('data-coupon-id');
        openUseCouponModal(cpId);
      });
    });
  }

  // Student Completes Job
  document.getElementById('btnCompleteJob').addEventListener('click', () => {
    const student = appState.students.find(s => s.id === appState.selectedStudentId);
    if (!student || student.jobCompleted) return;

    const assignedJob = appState.jobs.find(j => j.id === student.jobId);
    const wage = assignedJob ? assignedJob.wage : 10;

    student.jobCompleted = true;
    student.balance += wage;
    student.totalExp += wage; // Experience accumulates as money is earned

    // Add transaction history
    appState.transactions.unshift({
      id: 'tx_' + Date.now(),
      studentId: student.id,
      studentName: student.name,
      type: 'deposit',
      amount: wage,
      reason: `1인 1역(${assignedJob ? assignedJob.title : '역할'}) 일일 수행 보상`,
      date: new Date().toLocaleDateString('ko-KR')
    });

    Storage.saveData(appState);
    SoundFX.playCoin();
    showToast(`1인 1역 완료! +${wage}${appState.currencyName}와 경험치를 획득했습니다!`, '🎉');
    renderStudentView();
  });

  // Student Purchases Product
  function handleStudentBuyProduct(studentId, productId) {
    const student = appState.students.find(s => s.id === studentId);
    const product = appState.products.find(p => p.id === productId);

    if (!student || !product) return;
    if (product.stock <= 0) {
      alert('해당 상품은 품절되었습니다.');
      return;
    }
    if (student.balance < product.price) {
      alert('보유한 화폐가 부족합니다.');
      return;
    }

    // Deduct currency & stock (EXP is PRESERVED)
    student.balance -= product.price;
    product.stock -= 1;

    // Add to coupons/inventory
    if (!appState.coupons) appState.coupons = [];
    appState.coupons.unshift({
      id: 'cp_' + Date.now(),
      studentId: student.id,
      productId: product.id,
      name: product.name,
      icon: product.icon,
      purchasedAt: new Date().toLocaleDateString('ko-KR'),
      used: false
    });

    // Transaction log
    appState.transactions.unshift({
      id: 'tx_' + Date.now(),
      studentId: student.id,
      studentName: student.name,
      type: 'withdraw',
      amount: product.price,
      reason: `상점 구매: ${product.name}`,
      date: new Date().toLocaleDateString('ko-KR')
    });

    Storage.saveData(appState);
    SoundFX.playSuccess();
    showToast(`'${product.name}' 구매 완료! 내 보관함에 담겼습니다.`, '🛍️');
    renderStudentView();
  }

  // Open Use Coupon Modal
  function openUseCouponModal(couponId) {
    activeCouponIdToUse = couponId;
    const cp = appState.coupons.find(c => c.id === couponId);
    if (!cp) return;

    document.getElementById('useCouponName').textContent = `${cp.icon} ${cp.name}`;
    useCouponModal.classList.add('active');
    SoundFX.playClick();
  }

  document.getElementById('btnConfirmUseCoupon').addEventListener('click', () => {
    if (!activeCouponIdToUse) return;
    const cp = appState.coupons.find(c => c.id === activeCouponIdToUse);
    if (cp) {
      cp.used = true;
      Storage.saveData(appState);
      SoundFX.playSuccess();
      showToast(`'${cp.name}' 쿠폰을 사용 완료했습니다.`, '✅');
      useCouponModal.classList.remove('active');
      renderStudentView();
    }
  });

  /* ========================================================================
     TEACHER VIEW RENDER
     ======================================================================== */
  function renderTeacherView() {
    // 1. KPI Summaries
    const totalIssued = appState.students.reduce((sum, s) => sum + s.balance, 0);
    const avgExp = Math.round(appState.students.reduce((sum, s) => sum + s.totalExp, 0) / appState.students.length);
    const avgLevel = Math.round(appState.students.reduce((sum, s) => sum + getLevelInfo(s.totalExp).level, 0) / appState.students.length);
    const completedJobsCount = appState.students.filter(s => s.jobCompleted).length;

    document.getElementById('kpiTotalIssued').textContent = totalIssued.toLocaleString();
    document.getElementById('kpiTotalIssuedUnit').textContent = appState.currencyName;
    document.getElementById('kpiAvgLevel').textContent = `Lv.${avgLevel}`;
    document.getElementById('kpiAvgExp').textContent = `(평균 ${avgExp} XP)`;
    document.getElementById('kpiJobsCompleted').textContent = `${completedJobsCount} / ${appState.students.length}명`;

    // 2. Sub Tabs
    document.querySelectorAll('.teacher-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === teacherSubTab);
    });

    const secStudents = document.getElementById('teacherSectionStudents');
    const secJobs = document.getElementById('teacherSectionJobs');
    const secStore = document.getElementById('teacherSectionStore');
    const secHistory = document.getElementById('teacherSectionHistory');

    secStudents.style.display = teacherSubTab === 'students' ? 'block' : 'none';
    secJobs.style.display = teacherSubTab === 'jobs' ? 'block' : 'none';
    secStore.style.display = teacherSubTab === 'store' ? 'block' : 'none';
    secHistory.style.display = teacherSubTab === 'history' ? 'block' : 'none';

    if (teacherSubTab === 'students') {
      renderTeacherStudentsTable();
    } else if (teacherSubTab === 'jobs') {
      renderTeacherJobsManagement();
    } else if (teacherSubTab === 'store') {
      renderTeacherStoreManagement();
    } else if (teacherSubTab === 'history') {
      renderTeacherTransactionHistory();
    }
  }

  // Teacher Tab 1: Students Table
  function renderTeacherStudentsTable() {
    const tbody = document.getElementById('teacherStudentTableBody');
    tbody.innerHTML = '';

    const filtered = appState.students.filter(s => {
      const q = studentSearchQuery.trim().toLowerCase();
      if (!q) return true;
      return s.name.toLowerCase().includes(q) || s.id.toString() === q;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="empty-box">검색 결과와 일치하는 학생이 없습니다.</td></tr>`;
      return;
    }

    filtered.forEach(st => {
      const levelInfo = getLevelInfo(st.totalExp);
      const job = appState.jobs.find(j => j.id === st.jobId);
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td><span class="student-num-badge">${st.id}</span></td>
        <td>
          <div class="table-student-name">
            <span>${st.avatar || '👦'}</span>
            <strong>${st.name}</strong>
          </div>
        </td>
        <td><span class="currency-bold">${st.balance.toLocaleString()} ${appState.currencyName}</span></td>
        <td>
          <div>
            <span class="brand-badge">Lv.${levelInfo.level}</span>
            <small style="color:var(--text-muted); margin-left:4px;">${st.totalExp} XP</small>
          </div>
        </td>
        <td>
          <span>${job ? `${job.icon} ${job.title}` : '미배정'}</span>
        </td>
        <td>
          ${st.jobCompleted
            ? '<span class="job-status-pill completed">✓ 완료</span>'
            : '<span class="job-status-pill pending">⏳ 대기중</span>'
          }
        </td>
        <td>
          <div class="table-action-btns">
            <button class="btn btn-sm btn-cta-orange btn-open-pay-modal" data-student-id="${st.id}">
              화폐 지급/차감
            </button>
            <button class="btn btn-sm btn-soft-blue btn-switch-to-this-student" data-student-id="${st.id}">
              학생화면 보기
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Bind action buttons
    tbody.querySelectorAll('.btn-open-pay-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sId = parseInt(e.currentTarget.getAttribute('data-student-id'), 10);
        openCurrencyModal(sId);
      });
    });

    tbody.querySelectorAll('.btn-switch-to-this-student').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sId = parseInt(e.currentTarget.getAttribute('data-student-id'), 10);
        appState.selectedStudentId = sId;
        studentSelectDropdown.value = sId;
        setMode('student');
      });
    });
  }

  // Teacher Tab 2: Job Assignment
  function renderTeacherJobsManagement() {
    const container = document.getElementById('teacherJobsList');
    container.innerHTML = '';

    appState.jobs.forEach(job => {
      const assignedStudents = appState.students.filter(s => s.jobId === job.id);

      const jobCard = document.createElement('div');
      jobCard.className = 'job-hero-card';
      jobCard.innerHTML = `
        <div class="job-card-top">
          <div class="job-role-info">
            <div class="job-icon-box">${job.icon}</div>
            <div class="job-title-text">
              <h4>${job.title}</h4>
              <span class="job-reward-tag">일급 ${job.wage} ${appState.currencyName}</span>
            </div>
          </div>
        </div>
        <div class="job-desc">${job.desc}</div>
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
          <div style="font-size: 13px; font-weight: 700; color: var(--text-secondary);">
            담당 학생 (${assignedStudents.length}명):
            <span style="color: var(--blue-primary);">${assignedStudents.map(s => `${s.id}번 ${s.name}`).join(', ') || '없음'}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <select class="form-select student-assign-select" data-job-id="${job.id}" style="width: auto; padding: 6px 12px; font-size: 13px;">
              <option value="">+ 학생 추가 배정</option>
              ${appState.students.map(s => `<option value="${s.id}">${s.id}번 ${s.name} (현재: ${appState.jobs.find(j => j.id === s.jobId)?.title || '없음'})</option>`).join('')}
            </select>
          </div>
        </div>
      `;
      container.appendChild(jobCard);
    });

    container.querySelectorAll('.student-assign-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const jobId = e.target.getAttribute('data-job-id');
        const stId = parseInt(e.target.value, 10);
        if (!stId) return;

        const student = appState.students.find(s => s.id === stId);
        if (student) {
          student.jobId = jobId;
          student.jobCompleted = false; // reset completion
          Storage.saveData(appState);
          SoundFX.playSuccess();
          showToast(`${student.name} 학생의 역할이 배정되었습니다.`, '📋');
          renderTeacherJobsManagement();
        }
      });
    });
  }

  // Teacher Tab 3: Store Management
  function renderTeacherStoreManagement() {
    const container = document.getElementById('teacherStoreGrid');
    container.innerHTML = '';

    appState.products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-top">
          <div class="product-icon">${p.icon}</div>
          <div class="product-info">
            <h5>${p.name}</h5>
            <p>${p.desc}</p>
          </div>
        </div>
        <div class="product-bottom" style="margin-top: 14px;">
          <div>
            <div class="product-price">${p.price} ${appState.currencyName}</div>
            <div class="product-stock">현재 재고: <strong>${p.stock}</strong>개</div>
          </div>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-sm btn-soft-blue btn-stock-plus" data-id="${p.id}">+1 재고</button>
            <button class="btn btn-sm btn-soft-neutral btn-delete-product" data-id="${p.id}">삭제</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll('.btn-stock-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const p = appState.products.find(item => item.id === id);
        if (p) {
          p.stock += 1;
          Storage.saveData(appState);
          SoundFX.playClick();
          renderTeacherStoreManagement();
        }
      });
    });

    container.querySelectorAll('.btn-delete-product').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('이 상품을 삭제하시겠습니까?')) {
          appState.products = appState.products.filter(p => p.id !== id);
          Storage.saveData(appState);
          SoundFX.playClick();
          showToast('상품이 삭제되었습니다.', '🗑️');
          renderTeacherStoreManagement();
        }
      });
    });
  }

  // Teacher Tab 4: Transaction Logs
  function renderTeacherTransactionHistory() {
    const list = document.getElementById('teacherTxList');
    list.innerHTML = '';

    if (!appState.transactions || appState.transactions.length === 0) {
      list.innerHTML = `<div class="empty-box"><div class="empty-box-text">아직 입출금 내역이 없습니다.</div></div>`;
      return;
    }

    appState.transactions.slice(0, 50).forEach(tx => {
      const item = document.createElement('div');
      item.className = 'mission-item-card';
      const isDeposit = tx.type === 'deposit';

      item.innerHTML = `
        <div style="display:flex; align-items:center; gap:14px;">
          <div class="mission-bullet" style="background-color: ${isDeposit ? 'var(--success-soft)' : 'var(--danger-soft)'}; color: ${isDeposit ? 'var(--success-color)' : 'var(--danger-color)'};">
            ${isDeposit ? '▲' : '▼'}
          </div>
          <div>
            <div class="mission-title">
              <strong>${tx.studentName || `${tx.studentId}번 학생`}</strong> — ${tx.reason}
            </div>
            <div class="mission-meta">${tx.date}</div>
          </div>
        </div>
        <div style="font-size:16px; font-weight:800; color: ${isDeposit ? 'var(--blue-primary)' : 'var(--orange-accent)'};">
          ${isDeposit ? '+' : '-'}${tx.amount.toLocaleString()} ${appState.currencyName}
        </div>
      `;
      list.appendChild(item);
    });
  }

  /* ========================================================================
     MODAL CONTROLS: CURRENCY PAY / DEDUCT
     ======================================================================== */
  function openCurrencyModal(studentId) {
    activeModalStudentId = studentId;
    const student = appState.students.find(s => s.id === studentId);
    if (!student) return;

    document.getElementById('modalStudentInfo').textContent = `${student.id}번 ${student.name} (현재 잔액: ${student.balance.toLocaleString()} ${appState.currencyName})`;
    document.getElementById('payAmountInput').value = '10';
    document.getElementById('payReasonInput').value = '수업 참여 및 발표 우수';

    currencyModal.classList.add('active');
    SoundFX.playClick();
  }

  // Quick Amount preset buttons
  document.querySelectorAll('.amount-tag-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const amt = e.currentTarget.getAttribute('data-amount');
      document.getElementById('payAmountInput').value = amt;
      SoundFX.playClick();
    });
  });

  // Reason select preset change
  document.getElementById('presetReasonSelect').addEventListener('change', (e) => {
    if (e.target.value) {
      document.getElementById('payReasonInput').value = e.target.value;
    }
  });

  // Confirm Deposit
  document.getElementById('btnSubmitDeposit').addEventListener('click', () => {
    handleCurrencyTransaction('deposit');
  });

  // Confirm Deduct
  document.getElementById('btnSubmitDeduct').addEventListener('click', () => {
    handleCurrencyTransaction('withdraw');
  });

  function handleCurrencyTransaction(type) {
    if (!activeModalStudentId) return;
    const student = appState.students.find(s => s.id === activeModalStudentId);
    if (!student) return;

    const amount = parseInt(document.getElementById('payAmountInput').value, 10);
    const reason = document.getElementById('payReasonInput').value.trim() || (type === 'deposit' ? '교사 화폐 지급' : '벌금/차감');

    if (isNaN(amount) || amount <= 0) {
      alert('올바른 금액을 입력하세요.');
      return;
    }

    if (type === 'withdraw' && student.balance < amount) {
      if (!confirm(`학생의 잔액(${student.balance} ${appState.currencyName})보다 차감 금액이 큽니다. 마이너스 잔액을 허용하시겠습니까?`)) {
        return;
      }
    }

    if (type === 'deposit') {
      student.balance += amount;
      student.totalExp += amount; // Gamification rule: EXP accumulates on deposit
      SoundFX.playCoin();
      showToast(`${student.name} 학생에게 +${amount} ${appState.currencyName} 지급 완료!`, '💰');
    } else {
      student.balance -= amount;
      SoundFX.playClick();
      showToast(`${student.name} 학생에게 -${amount} ${appState.currencyName} 차감 완료!`, '📉');
    }

    appState.transactions.unshift({
      id: 'tx_' + Date.now(),
      studentId: student.id,
      studentName: student.name,
      type: type,
      amount: amount,
      reason: reason,
      date: new Date().toLocaleDateString('ko-KR')
    });

    Storage.saveData(appState);
    currencyModal.classList.remove('active');
    renderTeacherView();
  }

  /* ========================================================================
     MODAL CONTROLS: BULK PAY
     ======================================================================== */
  document.getElementById('btnOpenBulkPay').addEventListener('click', () => {
    document.getElementById('bulkAmountInput').value = '10';
    bulkPayModal.classList.add('active');
    SoundFX.playClick();
  });

  document.getElementById('btnConfirmBulkPay').addEventListener('click', () => {
    const amount = parseInt(document.getElementById('bulkAmountInput').value, 10);
    const reason = document.getElementById('bulkReasonInput').value.trim() || '학급 전체 기본 일급 지급';

    if (isNaN(amount) || amount <= 0) {
      alert('올바른 금액을 입력하세요.');
      return;
    }

    const todayDate = new Date().toLocaleDateString('ko-KR');
    appState.students.forEach(st => {
      st.balance += amount;
      st.totalExp += amount;
      appState.transactions.unshift({
        id: 'tx_bulk_' + st.id + '_' + Date.now(),
        studentId: st.id,
        studentName: st.name,
        type: 'deposit',
        amount: amount,
        reason: reason,
        date: todayDate
      });
    });

    Storage.saveData(appState);
    SoundFX.playSuccess();
    showToast(`전체 25명 학생에게 각 +${amount} ${appState.currencyName} 일괄 지급 완료!`, '🎉');
    bulkPayModal.classList.remove('active');
    renderTeacherView();
  });

  /* ========================================================================
     MODAL CONTROLS: ADD NEW PRODUCT
     ======================================================================== */
  document.getElementById('btnOpenAddProduct').addEventListener('click', () => {
    addProductModal.classList.add('active');
    SoundFX.playClick();
  });

  document.getElementById('btnConfirmAddProduct').addEventListener('click', () => {
    const name = document.getElementById('newProdName').value.trim();
    const price = parseInt(document.getElementById('newProdPrice').value, 10);
    const stock = parseInt(document.getElementById('newProdStock').value, 10);
    const icon = document.getElementById('newProdIcon').value;
    const desc = document.getElementById('newProdDesc').value.trim();

    if (!name || isNaN(price) || isNaN(stock)) {
      alert('상품명, 가격, 재고를 모두 정확히 입력해 주세요.');
      return;
    }

    appState.products.push({
      id: 'prod_' + Date.now(),
      name: name,
      category: 'coupon',
      price: price,
      stock: stock,
      icon: icon,
      desc: desc || '새로 등록된 학급 상점 상품'
    });

    Storage.saveData(appState);
    SoundFX.playSuccess();
    showToast(`'${name}' 상품이 상점에 등록되었습니다!`, '📦');
    addProductModal.classList.remove('active');
    renderTeacherStoreManagement();
  });

  /* ========================================================================
     EVENT LISTENERS & NAVIGATION
     ======================================================================== */

  // Switch between Teacher and Student Mode
  btnTeacherMode.addEventListener('click', () => setMode('teacher'));
  btnStudentMode.addEventListener('click', () => setMode('student'));

  // Student dropdown selector
  studentSelectDropdown.addEventListener('change', (e) => {
    appState.selectedStudentId = parseInt(e.target.value, 10);
    Storage.saveData(appState);
    SoundFX.playClick();
    renderStudentView();
  });

  // Sound toggle button
  btnSoundToggle.addEventListener('click', () => {
    const isEnabled = SoundFX.toggleSound();
    btnSoundToggle.innerHTML = isEnabled ? '🔔' : '🔕';
    btnSoundToggle.title = isEnabled ? '소리 켜짐' : '소리 꺼짐';
    showToast(isEnabled ? '효과음이 켜졌습니다.' : '효과음이 꺼졌습니다.', isEnabled ? '🔔' : '🔕');
  });

  // Data reset button
  btnDataReset.addEventListener('click', () => {
    if (confirm('모든 학생 화폐 및 활동 내역을 초기 상태로 리셋하시겠습니까?')) {
      appState = Storage.resetToDefaults();
      populateStudentDropdown();
      setMode(appState.currentMode);
      SoundFX.playSuccess();
      showToast('초기 데이터로 성공적으로 리셋되었습니다.', '🔄');
    }
  });

  // Teacher Sub Tabs
  document.querySelectorAll('.teacher-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      teacherSubTab = e.currentTarget.getAttribute('data-tab');
      SoundFX.playClick();
      renderTeacherView();
    });
  });

  // Teacher Student Search
  document.getElementById('teacherStudentSearch').addEventListener('input', (e) => {
    studentSearchQuery = e.target.value;
    renderTeacherStudentsTable();
  });

  // Close modals when clicking close button or backdrop
  document.querySelectorAll('.btn-modal-close, .btn-modal-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  /* ========================================================================
     APPLICATION BOOTSTRAP
     ======================================================================== */
  populateStudentDropdown();
  setMode(appState.currentMode || 'student');
});
