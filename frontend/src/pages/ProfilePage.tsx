/**
 * ProfilePage Component
 * User profile editing page
 */

import { useState, useEffect, FormEvent } from 'react';
import { useUser } from '../hooks/useUser';
import { Header } from '../components/common/Header';
import { Footer } from '../components/layout/Footer';
import { FormInput } from '../components/common/FormInput';
import { Button } from '../components/common/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { SuccessModal } from '../components/common/SuccessModal';

// For demo purposes, using a hardcoded user ID
// In a real app, this would come from authentication context
const CURRENT_USER_ID = '816f74a6-84cd-4e45-8d5e-33feada54ba0';

interface ProfilePageProps {
  onNavigateToReports?: () => void;
  onNavigateToSubmit?: () => void;
}

export function ProfilePage({ onNavigateToReports, onNavigateToSubmit }: ProfilePageProps = {}) {
  const { user, manager, loading, error, updating, update } = useUser(CURRENT_USER_ID);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // Initialize form when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Prepare update data (only changed fields)
    const updateData: {
      firstName?: string;
      lastName?: string;
      email?: string;
    } = {};

    if (formData.firstName !== user?.firstName) {
      updateData.firstName = formData.firstName;
    }
    if (formData.lastName !== user?.lastName) {
      updateData.lastName = formData.lastName;
    }
    if (formData.email !== user?.email) {
      updateData.email = formData.email;
    }

    // Only update if there are changes
    if (Object.keys(updateData).length > 0) {
      const success = await update(updateData);
      if (success) {
        setShowSuccess(true);
        // Clear password field
        setFormData((prev) => ({ ...prev, password: '' }));
      }
    } else {
      // No changes, just show success
      setShowSuccess(true);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
        <Header title="Edit Profile" onBack={handleBack} />
        <main className="flex-grow flex items-center justify-center pb-24">
          <LoadingSpinner />
        </main>
        <Footer
          activeTab="profile"
          onNavigateToReports={onNavigateToReports}
          onNavigateToSubmit={onNavigateToSubmit}
        />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
        <Header title="Edit Profile" onBack={handleBack} />
        <main className="flex-grow flex items-center justify-center pb-24 p-6">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || 'User not found'}</p>
            <Button onClick={handleBack}>Go Back</Button>
          </div>
        </main>
        <Footer
          activeTab="profile"
          onNavigateToReports={onNavigateToReports}
          onNavigateToSubmit={onNavigateToSubmit}
        />
      </div>
    );
  }

  // Update form data when user loads
  if (formData.firstName === '' && user) {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
    });
  }

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      <Header title="Edit Profile" onBack={handleBack} />

      <main className="flex-grow pb-24 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Your Information Section */}
          <div>
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">
              Your Information
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-muted-light dark:text-muted-dark mb-1"
                  htmlFor="firstName"
                >
                  First Name
                </label>
                <input
                  className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary text-foreground-light dark:text-foreground-dark"
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-muted-light dark:text-muted-dark mb-1"
                  htmlFor="lastName"
                >
                  Last Name
                </label>
                <input
                  className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary text-foreground-light dark:text-foreground-dark"
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-muted-light dark:text-muted-dark mb-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary text-foreground-light dark:text-foreground-dark"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-muted-light dark:text-muted-dark mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary text-foreground-light dark:text-foreground-dark placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Manager Information Section */}
          {manager && (
            <div>
              <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">
                Manager Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium text-muted-light dark:text-muted-dark mb-1"
                    htmlFor="managerName"
                  >
                    Manager's Name
                  </label>
                  <input
                    className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm px-4 py-2 text-foreground-light dark:text-foreground-dark"
                    id="managerName"
                    type="text"
                    value={`${manager.firstName} ${manager.lastName}`}
                    disabled
                    readOnly
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-muted-light dark:text-muted-dark mb-1"
                    htmlFor="managerEmail"
                  >
                    Manager's Email
                  </label>
                  <input
                    className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm px-4 py-2 text-foreground-light dark:text-foreground-dark"
                    id="managerEmail"
                    type="email"
                    value={manager.email}
                    disabled
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={updating}
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </main>

      <Footer
        activeTab="profile"
        onNavigateToReports={onNavigateToReports}
        onNavigateToSubmit={onNavigateToSubmit}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        title="Success!"
        message="Profile updated successfully!"
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
