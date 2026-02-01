'use client';

import { useState, useEffect } from 'react';
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  AlertTriangle,
  Zap,
  TrendingUp,
  Clock,
  Shield,
  Code,
  ExternalLink,
  CreditCard,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils/helpers';
import toast from 'react-hot-toast';

interface ApiKey {
  _id: string;
  name: string;
  key: string;
  fullKey?: string;
  plan: string;
  status: string;
  permissions: string[];
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
    requestsPerMonth: number;
  };
  usage: {
    totalRequests: number;
    requestsToday: number;
    requestsThisMonth: number;
  };
  expiresAt: string;
  createdAt: string;
}

const API_PLANS = {
  free: {
    name: 'Free Trial',
    price: 0,
    priceLabel: 'Free',
    duration: '7 days',
    features: ['50 requests/day', '500 requests/month', 'Basic endpoints'],
    color: 'sage',
    popular: false,
  },
  basic: {
    name: 'Basic',
    price: 999,
    priceLabel: '₹999/month',
    duration: '30 days',
    features: ['1,000 requests/day', '10,000 requests/month', 'Stats endpoint', 'Map data'],
    color: 'ocean',
    popular: false,
  },
  premium: {
    name: 'Premium',
    price: 2999,
    priceLabel: '₹2,999/month',
    duration: '30 days',
    features: ['5,000 requests/day', '50,000 requests/month', 'Export data', 'Analytics'],
    color: 'forest',
    popular: true,
  },
  enterprise: {
    name: 'Enterprise',
    price: 9999,
    priceLabel: '₹9,999/month',
    duration: '30 days',
    features: ['20,000 requests/day', '200,000 requests/month', 'Advanced analytics', 'Priority support'],
    color: 'purple',
    popular: false,
  },
};

export default function ApiDashboard() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<ApiKey | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/ngo/api-keys', {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        setApiKeys(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      toast.error('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const createFreeKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for your API key');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/ngo/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newKeyName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setNewlyCreatedKey(data.data);
      setShowCreateModal(false);
      setNewKeyName('');
      toast.success('API key created successfully!');
      fetchApiKeys();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create API key');
    } finally {
      setCreating(false);
    }
  };

  const purchaseApiKey = async () => {
    if (!newKeyName.trim() || !selectedPlan) {
      toast.error('Please enter a name and select a plan');
      return;
    }

    setCreating(true);
    try {
      // Load Razorpay
      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Create order
      const orderResponse = await fetch('/api/ngo/api-keys/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ plan: selectedPlan, keyName: newKeyName }),
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok) {
        throw new Error(orderData.error);
      }

      // Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'Eco Sakshi',
        description: `${orderData.data.plan} API Access`,
        order_id: orderData.data.orderId,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch('/api/ngo/api-keys/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: selectedPlan,
                keyName: newKeyName,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
              setNewlyCreatedKey(verifyData.data);
              setShowPurchaseModal(false);
              setNewKeyName('');
              setSelectedPlan('');
              toast.success('Payment successful! API key created.');
              fetchApiKeys();
            } else {
              throw new Error(verifyData.error);
            }
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Payment verification failed');
          }
        },
        theme: { color: '#166534' },
        modal: {
          ondismiss: () => setCreating(false),
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to initiate payment');
      setCreating(false);
    }
  };

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const revokeKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/ngo/api-keys?id=${keyId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to revoke key');
      }

      toast.success('API key revoked');
      fetchApiKeys();
    } catch (error) {
      toast.error('Failed to revoke API key');
    }
  };

  const copyToClipboard = async (text: string, keyId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(keyId)) {
        next.delete(keyId);
      } else {
        next.add(keyId);
      }
      return next;
    });
  };

  const maskKey = (key: string) => {
    return key.substring(0, 8) + '••••••••••••••••';
  };

  const hasFreeTrial = apiKeys.some((k) => k.plan === 'free');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-sage-900 font-display">API Access</h1>
          <p className="text-sage-600 mt-2">
            Manage your API keys and access environmental data programmatically
          </p>
        </div>
        <div className="flex gap-3">
          {!hasFreeTrial && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-outline"
            >
              <Zap className="w-5 h-5" />
              Free Trial
            </button>
          )}
          <button
            onClick={() => setShowPurchaseModal(true)}
            className="btn-primary"
          >
            <Plus className="w-5 h-5" />
            Get API Key
          </button>
        </div>
      </div>

      {/* Newly Created Key Banner */}
      {newlyCreatedKey && newlyCreatedKey.fullKey && (
        <div className="card bg-gradient-to-r from-forest-50 to-ocean-50 border-2 border-forest-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center flex-shrink-0">
                <Key className="w-6 h-6 text-forest-600" />
              </div>
              <div>
                <h3 className="font-semibold text-forest-800">
                  🎉 Your API Key is Ready!
                </h3>
                <p className="text-forest-600 text-sm mt-1 mb-3">
                  Save this key now - it won't be shown again!
                </p>
                <div className="flex items-center gap-2 p-3 bg-forest-900 rounded-lg">
                  <code className="text-forest-300 text-sm font-mono flex-1 break-all">
                    {newlyCreatedKey.fullKey}
                  </code>
                  <button
                    onClick={() => copyToClipboard(newlyCreatedKey.fullKey!, 'new')}
                    className="p-2 hover:bg-forest-800 rounded-lg transition-colors"
                  >
                    {copiedKey === 'new' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-forest-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setNewlyCreatedKey(null)}
              className="p-2 hover:bg-forest-100 rounded-lg"
            >
              <X className="w-5 h-5 text-forest-600" />
            </button>
          </div>
        </div>
      )}

      {/* API Keys List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-sage-900 font-display">Your API Keys</h2>
        
        {apiKeys.length === 0 ? (
          <div className="card text-center py-12">
            <Key className="w-12 h-12 text-sage-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-sage-900 mb-2">No API Keys Yet</h3>
            <p className="text-sage-600 mb-6">
              Create your first API key to start accessing environmental data
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <Zap className="w-5 h-5" />
              Start Free Trial
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey._id} className="card">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-sage-900">{apiKey.name}</h3>
                      <span className={cn(
                        'badge text-xs',
                        apiKey.status === 'active' ? 'bg-green-100 text-green-700' :
                        apiKey.status === 'expired' ? 'bg-red-100 text-red-700' :
                        'bg-sage-100 text-sage-700'
                      )}>
                        {apiKey.status}
                      </span>
                      <span className={cn(
                        'badge text-xs',
                        apiKey.plan === 'enterprise' ? 'bg-purple-100 text-purple-700' :
                        apiKey.plan === 'premium' ? 'bg-forest-100 text-forest-700' :
                        apiKey.plan === 'basic' ? 'bg-ocean-100 text-ocean-700' :
                        'bg-sage-100 text-sage-700'
                      )}>
                        {apiKey.plan}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <code className="text-sm font-mono text-sage-600 bg-sage-100 px-3 py-1 rounded-lg">
                        {visibleKeys.has(apiKey._id) ? apiKey.key : maskKey(apiKey.key)}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(apiKey._id)}
                        className="p-1.5 hover:bg-sage-100 rounded-lg"
                      >
                        {visibleKeys.has(apiKey._id) ? (
                          <EyeOff className="w-4 h-4 text-sage-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-sage-500" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(apiKey.key, apiKey._id)}
                        className="p-1.5 hover:bg-sage-100 rounded-lg"
                      >
                        {copiedKey === apiKey._id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-sage-500" />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-sage-600">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {apiKey.usage?.totalRequests || 0} total requests
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Expires: {formatDate(apiKey.expiresAt)}
                      </span>
                    </div>
                  </div>

                  {/* Usage Stats */}
                  <div className="flex flex-wrap gap-4 lg:flex-nowrap">
                    <div className="text-center p-3 bg-sage-50 rounded-xl min-w-[100px]">
                      <p className="text-2xl font-bold text-sage-900">
                        {apiKey.usage?.requestsToday || 0}
                      </p>
                      <p className="text-xs text-sage-500">Today</p>
                      <p className="text-xs text-sage-400">/ {apiKey.rateLimit.requestsPerDay}</p>
                    </div>
                    <div className="text-center p-3 bg-sage-50 rounded-xl min-w-[100px]">
                      <p className="text-2xl font-bold text-sage-900">
                        {apiKey.usage?.requestsThisMonth || 0}
                      </p>
                      <p className="text-xs text-sage-500">This Month</p>
                      <p className="text-xs text-sage-400">/ {apiKey.rateLimit.requestsPerMonth.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => revokeKey(apiKey._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Revoke Key"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* API Documentation Preview */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-ocean-100 flex items-center justify-center">
            <Code className="w-5 h-5 text-ocean-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-sage-900 font-display">Quick Start</h2>
            <p className="text-sm text-sage-600">Start making API requests in seconds</p>
          </div>
        </div>

        <div className="bg-sage-900 rounded-xl p-6 overflow-x-auto">
          <pre className="text-sm text-sage-300 font-mono">
{`# List all reports
curl -X GET "https://ecosakshi.com/api/v1/reports" \\
  -H "x-api-key: YOUR_API_KEY"

# Get report statistics
curl -X GET "https://ecosakshi.com/api/v1/stats" \\
  -H "x-api-key: YOUR_API_KEY"

# Filter by location
curl -X GET "https://ecosakshi.com/api/v1/reports?city=Mumbai&state=Maharashtra" \\
  -H "x-api-key: YOUR_API_KEY"`}
          </pre>
        </div>

        <div className="mt-4 flex justify-end">
          <a
            href="/docs/api"
            className="text-forest-600 hover:text-forest-700 font-medium text-sm flex items-center gap-1"
          >
            View Full Documentation
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Free Trial Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-sage-900 font-display">
                Start Free Trial
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-sage-100 rounded-lg"
              >
                <X className="w-5 h-5 text-sage-500" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-forest-50 rounded-xl border border-forest-200">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-forest-600" />
                <span className="font-semibold text-forest-800">7-Day Free Trial</span>
              </div>
              <ul className="space-y-1 text-sm text-forest-700">
                <li>• 50 requests per day</li>
                <li>• 500 requests total</li>
                <li>• Basic endpoints access</li>
              </ul>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-sage-700 mb-2">
                API Key Name
              </label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Development Key"
                className="input-field"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={createFreeKey}
                disabled={creating}
                className="flex-1 btn-primary"
              >
                {creating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    Create Key
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-6 my-8 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-sage-900 font-display">
                Choose Your Plan
              </h3>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="p-2 hover:bg-sage-100 rounded-lg"
              >
                <X className="w-5 h-5 text-sage-500" />
              </button>
            </div>

            {/* Key Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-sage-700 mb-2">
                API Key Name *
              </label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production Key"
                className="input-field"
              />
            </div>

            {/* Plans Grid */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {(['basic', 'premium', 'enterprise'] as const).map((plan) => {
                const config = API_PLANS[plan];
                const isSelected = selectedPlan === plan;
                
                return (
                  <button
                    key={plan}
                    onClick={() => setSelectedPlan(plan)}
                    className={cn(
                      'relative p-6 rounded-2xl border-2 text-left transition-all',
                      isSelected
                        ? 'border-forest-500 bg-forest-50'
                        : 'border-sage-200 hover:border-sage-300'
                    )}
                  >
                    {config.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-forest-600 text-white text-xs font-semibold rounded-full">
                        Most Popular
                      </div>
                    )}
                    
                    <h4 className="font-bold text-sage-900 mb-1">{config.name}</h4>
                    <p className="text-2xl font-bold text-forest-600 mb-3">
                      {config.priceLabel}
                    </p>
                    
                    <ul className="space-y-2">
                      {config.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-sage-600">
                          <CheckCircle2 className="w-4 h-4 text-forest-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {isSelected && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle2 className="w-6 h-6 text-forest-600" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={purchaseApiKey}
                disabled={creating || !selectedPlan || !newKeyName.trim()}
                className="flex-1 btn-primary"
              >
                {creating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay & Get Key
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}