import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';

const RegisterForm = ({ onSubmit, loading, error }) => {
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [member2Name, setMember2Name] = useState('');
  const [member2Email, setMember2Email] = useState('');
  const [member3Name, setMember3Name] = useState('');
  const [member3Email, setMember3Email] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if ((member2Name && !member2Email) || (!member2Name && member2Email)) {
      setFormError('Please provide both name and email for Member 2, or leave both blank.');
      return;
    }
    if ((member3Name && !member3Email) || (!member3Name && member3Email)) {
      setFormError('Please provide both name and email for Member 3, or leave both blank.');
      return;
    }

    const members = [{ name: leaderName, email: leaderEmail, role: 'leader' }];
    if (member2Name && member2Email) members.push({ name: member2Name, email: member2Email, role: 'member' });
    if (member3Name && member3Email) members.push({ name: member3Name, email: member3Email, role: 'member' });

    if (!loading) onSubmit({ teamName, password, members });
  };

  const inputClass = "w-full px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-500 transition";

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="space-y-8 text-left bg-gradient-to-br from-blue-50 via-white to-blue-100 p-10 rounded-2xl shadow-lg border border-blue-100"
    >
      {/* Team Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Team Name *</label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className={inputClass}
            placeholder="Enter your team name"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Team Password *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="Choose a password"
            required
          />
        </div>
      </div>

      <hr className="border-blue-100" />

      {/* Leader Section */}
      <h3 className="text-xl font-semibold text-blue-600 mb-2">Team Leader *</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Leader Name</label>
          <input
            type="text"
            value={leaderName}
            onChange={(e) => setLeaderName(e.target.value)}
            className={inputClass}
            placeholder="Enter leader's name"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700">Leader Email</label>
          <input
            type="email"
            value={leaderEmail}
            onChange={(e) => setLeaderEmail(e.target.value)}
            className={inputClass}
            placeholder="Enter leader's email"
            required
          />
        </div>
      </div>

      {/* Member 2 */}
      <h3 className="text-xl font-semibold text-blue-600 mb-2">Member 2 (Optional)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Member 2 Name</label>
          <input
            type="text"
            value={member2Name}
            onChange={(e) => setMember2Name(e.target.value)}
            className={inputClass}
            placeholder="Enter member name"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700">Member 2 Email</label>
          <input
            type="email"
            value={member2Email}
            onChange={(e) => setMember2Email(e.target.value)}
            className={inputClass}
            placeholder="Enter member email"
          />
        </div>
      </div>

      {/* Member 3 */}
      <h3 className="text-xl font-semibold text-blue-600 mb-2">Member 3 (Optional)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Member 3 Name</label>
          <input
            type="text"
            value={member3Name}
            onChange={(e) => setMember3Name(e.target.value)}
            className={inputClass}
            placeholder="Enter member name"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700">Member 3 Email</label>
          <input
            type="email"
            value={member3Email}
            onChange={(e) => setMember3Email(e.target.value)}
            className={inputClass}
            placeholder="Enter member email"
          />
        </div>
      </div>

      {/* Error Messages */}
      {formError && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-yellow-500 text-center font-medium"
        >
          {formError}
        </motion.p>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-center font-medium"
        >
          {error}
        </motion.p>
      )}

      {/* Submit Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="pt-4"
      >
        <Button
          type="submit"
          variant="primary"
          className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-lg py-3 rounded-xl shadow-md shadow-blue-300/30 transition-all duration-300"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Proceed to Payment (₹2000)'}
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default RegisterForm;
