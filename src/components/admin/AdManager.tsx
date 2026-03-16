'use client';

import { useEffect, useState } from 'react';
import { AD_SLOT_NAMES, AD_SLOT_LABELS, type AdSlotName } from '@/config/ads';

interface AdConfig {
  id: string;
  slotName: AdSlotName;
  adCode: string;
  enabled: boolean;
  updatedAt: string;
  createdAt: string;
}

export function AdManager() {
  const [ads, setAds] = useState<AdConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlot, setEditingSlot] = useState<AdSlotName | null>(null);
  const [adCode, setAdCode] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchAds();
  }, []);

  async function fetchAds() {
    try {
      const response = await fetch('/api/admin/ads');
      const data = await response.json();
      if (response.ok) {
        setAds(data.ads || []);
      }
    } catch (error) {
      console.error('Failed to fetch ads:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(slotName: AdSlotName) {
    const existingAd = ads.find((ad) => ad.slotName === slotName);
    setEditingSlot(slotName);
    setAdCode(existingAd?.adCode || '');
    setEnabled(existingAd?.enabled ?? true);
    setMessage(null);
  }

  function handleCancel() {
    setEditingSlot(null);
    setAdCode('');
    setEnabled(true);
    setMessage(null);
  }

  async function handleSave() {
    if (!editingSlot) return;

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotName: editingSlot,
          adCode: adCode.trim(),
          enabled,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Ad configuration saved successfully!' });
        await fetchAds();
        setTimeout(() => {
          handleCancel();
        }, 1500);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save ad configuration' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slotName: AdSlotName) {
    if (!confirm('Are you sure you want to delete this ad configuration?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/ads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotName }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Ad configuration deleted successfully!' });
        await fetchAds();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to delete ad configuration' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const allSlotNames = Object.values(AD_SLOT_NAMES) as AdSlotName[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ad Management</h2>
        <p className="text-gray-600">
          Configure advertisement codes for different sections of your website. Ads will only display when
          enabled and contain valid ad code.
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Ad Slots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {allSlotNames.map((slotName) => {
          const existingAd = ads.find((ad) => ad.slotName === slotName);
          const slotInfo = AD_SLOT_LABELS[slotName];
          const isEditing = editingSlot === slotName;

          return (
            <div key={slotName} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{slotInfo.label}</h3>
                    <p className="text-sm text-gray-500">{slotInfo.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {existingAd && (
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          existingAd.enabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {existingAd.enabled ? 'Active' : 'Disabled'}
                      </span>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ad Code (HTML/JavaScript)
                      </label>
                      <textarea
                        value={adCode}
                        onChange={(e) => setAdCode(e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                        placeholder="<script>...</script> or <ins class='adsbygoogle'>...</ins>"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`enabled-${slotName}`}
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`enabled-${slotName}`} className="ml-2 block text-sm text-gray-700">
                        Enable this ad slot
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {existingAd && existingAd.adCode ? (
                      <>
                        <div className="bg-gray-50 rounded p-3 border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Preview:</p>
                          <code className="text-xs text-gray-700 break-all">
                            {existingAd.adCode.substring(0, 100)}
                            {existingAd.adCode.length > 100 && '...'}
                          </code>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(slotName)}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(slotName)}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(slotName)}
                        className="w-full px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition font-medium"
                      >
                        + Configure Ad
                      </button>
                    )}

                    {existingAd && (
                      <p className="text-xs text-gray-400">
                        Last updated: {new Date(existingAd.updatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 How to Use</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Click "Configure Ad" to add ad code to any slot</li>
          <li>• Paste your AdSense, ad network, or custom HTML/JavaScript code</li>
          <li>• Toggle the "Enable" checkbox to activate or deactivate ads</li>
          <li>• Ads will only appear on public pages when they are enabled and contain valid code</li>
          <li>• You can edit or delete ad configurations at any time</li>
        </ul>
      </div>
    </div>
  );
}
