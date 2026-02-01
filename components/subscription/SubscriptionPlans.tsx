'use client';

import { useEffect, useState } from 'react';
import {
  Check,
  X,
  Crown,
  Building2,
  Zap,
  Loader2,
  AlertCircle,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { cn, formatDate } from '@/lib/utils/helpers';
import { SUBSCRIPTION_PLANS } from '@/lib/utils/constants';

interface SubscriptionPlansProps {
  currentUser: any;
}

export default function SubscriptionPlans({ currentUser }: SubscriptionPlansProps) {
  const {
    loading,
    currentSubscription,
    fetchCurrentSubscription,
    initiatePayment,
    cancelSubscription,
  } = useSubscription();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    fetchCurrentSubscription();
  }, [fetchCurrentSubscription]);

  const currentPlan = currentUser.subscription?.plan || 'free';
  const validUntil = currentUser.subscription?.validUntil;

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'premium':
        return Crown;
      case 'enterprise':
        return Building2;
      default:
        return Zap;
    }
  };

  return (
    <div className="space-y-8">
      {/* Current Plan Banner */}
      {currentPlan !== 'free' && validUntil && (
        <div className="card bg-gradient-to-r from-forest-600 to-ocean-600 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  {currentPlan === 'premium' ? 'Premium' : 'Enterprise'} Plan Active
                </h2>
                <p className="text-white/80 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Valid until {formatDate(validUntil)}
                </p>
              </div>
            </div>

            {currentSubscription?.status !== 'cancelled' && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="text-white/80 hover:text-white text-sm underline"
              >
                Cancel Subscription
              </button>
            )}

            {currentSubscription?.status === 'cancelled' && (
              <span className="text-amber-200 text-sm">
                Cancelled - Access until {formatDate(validUntil)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const PlanIcon = getPlanIcon(plan.id);
          const isCurrentPlan = currentPlan === plan.id;
          const isPopular = plan.id === 'premium';

          return (
            <div
              key={plan.id}
              className={cn(
                'card relative overflow-hidden transition-all',
                isPopular && 'ring-2 ring-forest-500 shadow-soft-lg',
                isCurrentPlan && 'bg-forest-50'
              )}
            >
              {isPopular && (
                <div className="absolute top-0 right-0 bg-forest-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-xl">
                  Most Popular
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      plan.id === 'free' && 'bg-sage-100',
                      plan.id === 'premium' && 'bg-forest-100',
                      plan.id === 'enterprise' && 'bg-purple-100'
                    )}
                  >
                    <PlanIcon
                      className={cn(
                        'w-6 h-6',
                        plan.id === 'free' && 'text-sage-600',
                        plan.id === 'premium' && 'text-forest-600',
                        plan.id === 'enterprise' && 'text-purple-600'
                      )}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sage-900 font-display">{plan.name}</h3>
                    {isCurrentPlan && (
                      <span className="text-xs text-forest-600 font-medium">Current Plan</span>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-sage-900 font-display">
                      {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                    </span>
                    {plan.price > 0 && <span className="text-sage-500">/month</span>}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <Check className="w-5 h-5 text-forest-500 flex-shrink-0" />
                      <span className="text-sage-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.id === 'free' ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl border-2 border-sage-200 text-sage-500 font-medium cursor-not-allowed"
                  >
                    {isCurrentPlan ? 'Current Plan' : 'Default Plan'}
                  </button>
                ) : isCurrentPlan ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-forest-100 text-forest-700 font-medium cursor-not-allowed"
                  >
                    <Check className="w-5 h-5 inline mr-2" />
                    Active
                  </button>
                ) : (
                  <button
                    onClick={() => initiatePayment(plan.id)}
                    disabled={loading || currentPlan !== 'free'}
                    className={cn(
                      'w-full py-3 rounded-xl font-medium transition-all',
                      plan.id === 'premium'
                        ? 'bg-forest-600 text-white hover:bg-forest-700'
                        : 'bg-purple-600 text-white hover:bg-purple-700',
                      (loading || currentPlan !== 'free') && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin inline" />
                    ) : currentPlan !== 'free' ? (
                      'Downgrade First'
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 inline mr-2" />
                        Subscribe Now
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div className="card">
        <h3 className="text-lg font-semibold text-sage-900 font-display mb-6">
          Features Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sage-200">
                <th className="text-left py-3 px-4 font-semibold text-sage-700">Feature</th>
                <th className="text-center py-3 px-4 font-semibold text-sage-700">Free</th>
                <th className="text-center py-3 px-4 font-semibold text-forest-700 bg-forest-50">
                  Premium
                </th>
                <th className="text-center py-3 px-4 font-semibold text-purple-700">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-100">
              {[
                { feature: 'Monthly Reports', free: '5', premium: 'Unlimited', enterprise: 'Unlimited' },
                { feature: 'Priority Review', free: false, premium: true, enterprise: true },
                { feature: 'Advanced Analytics', free: false, premium: true, enterprise: true },
                { feature: 'Export Reports', free: false, premium: true, enterprise: true },
                { feature: 'API Access', free: false, premium: false, enterprise: true },
                { feature: 'Bulk Data Export', free: false, premium: false, enterprise: true },
                { feature: 'Priority Support', free: false, premium: true, enterprise: true },
                { feature: 'Dedicated Account Manager', free: false, premium: false, enterprise: true },
              ].map((row, index) => (
                <tr key={index} className="hover:bg-sage-50">
                  <td className="py-3 px-4 text-sage-700">{row.feature}</td>
                  <td className="py-3 px-4 text-center">
                    {typeof row.free === 'boolean' ? (
                      row.free ? (
                        <Check className="w-5 h-5 text-forest-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-sage-300 mx-auto" />
                      )
                    ) : (
                      <span className="text-sage-600">{row.free}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center bg-forest-50">
                    {typeof row.premium === 'boolean' ? (
                      row.premium ? (
                        <Check className="w-5 h-5 text-forest-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-sage-300 mx-auto" />
                      )
                    ) : (
                      <span className="text-forest-600 font-medium">{row.premium}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {typeof row.enterprise === 'boolean' ? (
                      row.enterprise ? (
                        <Check className="w-5 h-5 text-purple-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-sage-300 mx-auto" />
                      )
                    ) : (
                      <span className="text-purple-600 font-medium">{row.enterprise}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="card">
        <h3 className="text-lg font-semibold text-sage-900 font-display mb-6">
          Frequently Asked Questions
        </h3>

        <div className="space-y-4">
          {[
            {
              q: 'Can I cancel anytime?',
              a: 'Yes, you can cancel your subscription at any time. You will continue to have access until the end of your billing period.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit/debit cards, UPI, net banking, and popular wallets through Razorpay.',
            },
            {
              q: 'Is there a refund policy?',
              a: 'We offer a 7-day money-back guarantee if you are not satisfied with your subscription.',
            },
            {
              q: 'Can I upgrade or downgrade my plan?',
              a: 'You can upgrade anytime. To downgrade, cancel your current subscription and subscribe to the new plan after it expires.',
            },
          ].map((item, index) => (
            <div key={index} className="p-4 rounded-xl bg-sage-50">
              <h4 className="font-medium text-sage-900 mb-2">{item.q}</h4>
              <p className="text-sm text-sage-600">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-sage-900">Cancel Subscription?</h3>
                <p className="text-sm text-sage-600">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sage-700 mb-6">
              You will continue to have access to premium features until the end of your current
              billing period. After that, your account will revert to the free plan.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-3 rounded-xl border-2 border-sage-200 text-sage-700 font-medium hover:bg-sage-50"
              >
                Keep Subscription
              </button>
              <button
                onClick={() => {
                  cancelSubscription();
                  setShowCancelConfirm(false);
                }}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}