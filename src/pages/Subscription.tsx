import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileNav from '../components/ProfileNav';
import Breadcrumb from '../components/Breadcrumb';
import SubscriptionCard from '../components/SubscriptionCard';
import { useTranslation } from 'react-i18next';

const Subscription: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('subscription');
  const [selectedPlan, setSelectedPlan] = useState('week');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'profile') navigate('/profile');
    else if (tab === 'trips') navigate('/trips');
    else if (tab === 'notifications') navigate('/notifications');
  };

  const subscriptions = [
    {
      plan: 'Week',
      price: '19',
      period: 'Per week',
      id: 'week',
      features: [
        { name: 'Basic trip planning', included: true },
        { name: 'Limited destinations', included: true },
        { name: 'Email support', included: true },
        { name: 'Mobile app access', included: false },
      ]
    },
    {
      plan: 'Month',
      price: '39',
      period: 'Per month',
      id: 'month',
      features: [
        { name: 'Advanced trip planning', included: true },
        { name: 'Unlimited destinations', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Mobile app access', included: true },
      ]
    },
    {
      plan: 'Season',
      price: '89',
      period: 'Per month',
      id: 'season',
      features: [
        { name: 'Premium trip planning', included: true },
        { name: 'VIP destinations access', included: true },
        { name: '24/7 phone support', included: true },
        { name: 'Mobile app access', included: true },
      ]
    },
    {
      plan: 'Year',
      price: '199',
      period: 'Per month',
      id: 'year',
      features: [
        { name: 'Ultimate trip planning', included: true },
        { name: 'Exclusive destinations', included: true },
        { name: 'Dedicated concierge', included: true },
        { name: 'Mobile app access', included: true },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header showIconButtons showNavLinks={false} />
      <main className="px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{t('blog.back')}</span>
          </Link>
          <Breadcrumb
            items={[
              { label: t('profileNav.profile'), href: '/profile' },
              { label: t('profileNav.subscription') }
            ]}
            className="mb-6"
          />
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <ProfileNav activeTab={activeTab} onTabChange={handleTabChange} />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('subscription.title')}</h1>
            <p className="text-lg text-gray-600">{t('subscription.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptions.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                plan={sub.plan}
                price={sub.price}
                period={sub.period}
                features={sub.features}
                isSelected={selectedPlan === sub.id}
                onClick={() => setSelectedPlan(sub.id)}
                buttonText={sub.id === 'week' ? t('subscription.currentPlan') : t('subscription.update')}
                onButtonClick={() => console.log(`Update to ${sub.plan}`)}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Subscription;