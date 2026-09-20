(() => {
  const section = document.querySelector('.mira-pricing');
  if (!section) return;

  const plans = {
    free: {
      type: 'Free', price: '$0', period: '',
      description: 'Try MIRA’s content tools, create your two free assets, and connect 1 TikTok account you own.',
      meta: 'Two free assets included.', delivery: '1 owned account', cta: 'Start free',
      features: ['MIRA content tools', '2 free assets', '1 TikTok account you own', 'Generation available with credits'],
    },
    pro: {
      type: 'Pro', price: '$29', period: '/ MONTH',
      description: 'Connect up to 10 accounts you own and run up to 2 automated campaigns.',
      meta: 'Use owned accounts, rented accounts, or both.', delivery: 'Up to 10 owned accounts', cta: 'Choose Pro',
      features: ['Up to 10 accounts you own', 'Up to 2 automated campaigns', 'Content generation uses credits', 'Booketeer available as an add-on'],
    },
    studio: {
      type: 'Studio', price: '$59', period: '/ MONTH',
      description: 'Connect up to 20 accounts you own and run up to 5 automated campaigns.',
      meta: 'Rented accounts are priced separately.', delivery: 'Up to 20 owned accounts', cta: 'Choose Studio',
      features: ['Up to 20 accounts you own', 'Up to 5 automated campaigns', 'Content generation uses credits', 'Booketeer available as an add-on'],
    },
  };

  const buttons = [...section.querySelectorAll('.plan-selector__button')];
  const indicator = section.querySelector('.plan-selector__indicator');
  const card = section.querySelector('.pricing-card');
  const fields = {
    type: section.querySelector('[data-plan-type]'), price: section.querySelector('[data-plan-price]'), period: section.querySelector('[data-plan-period]'),
    description: section.querySelector('[data-plan-description]'), meta: section.querySelector('[data-plan-meta]'), delivery: section.querySelector('[data-plan-delivery]'),
    cta: section.querySelector('[data-plan-cta]'), link: section.querySelector('[data-plan-link]'), list: section.querySelector('[data-feature-list]'),
  };

  const renderFeatures = (features) => { fields.list.replaceChildren(...features.map((feature) => { const item = document.createElement('li'); item.textContent = feature; return item; })); };
  const updatePlan = (planName) => {
    const plan = plans[planName]; if (!plan) return;
    card.classList.add('plan-content-changing');
    window.setTimeout(() => {
      fields.type.textContent = plan.type; fields.price.textContent = plan.price; fields.period.textContent = plan.period;
      fields.description.textContent = plan.description; fields.meta.textContent = plan.meta; fields.delivery.textContent = plan.delivery; fields.cta.textContent = plan.cta;
      fields.link.href = 'https://mira.indieauthormedia.com/alpha/pricing'; renderFeatures(plan.features);
      requestAnimationFrame(() => card.classList.remove('plan-content-changing'));
    }, 150);
  };

  buttons.forEach((button, index) => button.addEventListener('click', () => {
    if (button.classList.contains('is-active')) return;
    buttons.forEach((item) => { item.classList.toggle('is-active', item === button); item.setAttribute('aria-selected', String(item === button)); });
    indicator.style.transform = `translateX(${index * 100}%)`; updatePlan(button.dataset.plan);
  }));
  renderFeatures(plans.free.features);
})();
