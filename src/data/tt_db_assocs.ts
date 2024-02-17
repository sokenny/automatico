export const assocs = {
    owners: `Owners.associate = (models) => {
        Owners.hasMany(models.listings, {
          foreignKey: 'owner_id',
          sourceKey: 'id',
        });
        Owners.hasMany(models.owner_verifications, {
          foreignKey: 'owner_id',
          sourceKey: 'id',
        });
        Owners.hasMany(models.landlord_payments, {
          foreignKey: 'owner_id',
          sourceKey: 'id',
        });
        Owners.hasMany(models.affiliate_codes, {
          foreignKey: 'owner_id',
          sourceKey: 'id',
        });
        Owners.hasMany(models.stripe_subscriptions, {
          foreignKey: 'owner_id',
          sourceKey: 'id',
        });
        Owners.hasMany(models.payout_ledgers, {
          foreignKey: 'owner_id',
          sourceKey: 'id',
        });
        Owners.hasMany(models.check_ins, {
          foreignKey: 'owner_id',
          sourceKey: 'id',
        });
        Owners.hasMany(models.leads, {
          foreignKey: 'owner_id',
          sourceKey: 'id',
        });
        Owners.hasMany(models.conversations, {
          foreignKey: 'owner_id',
          sourceKey: 'id',
        });
        Owners.hasOne(models.owner_onboardings, {
          foreignKey: 'owner_id',
          targetKey: 'id',
        });
        Owners.hasMany(models.rent_payments, {
          foreignKey: 'owner_id',
          sourceKey: 'id',
        });
        Owners.hasMany(models.contact_changes, {
          foreignKey: 'owner_id',
          sourceKey: 'id',
        });
        Owners.hasMany(models.signature_request_signers, {
          foreignKey: 'owner_id',
          sourceKey: 'id',
        });
        Owners.hasMany(models.verification_documents, {
          foreignKey: 'owner_id',
          sourceKey: 'id',
        });
        Owners.hasMany(models.stripe_identities, {
          foreignKey: 'owner_id',
          sourceKey: 'id',
        });
        Owners.hasMany(models.trusted_devices, {
          foreignKey: 'owner_id',
          targetKey: 'id',
        });
        Owners.hasOne(models.owner_statistics, {
          foreignKey: 'owner_id',
          targetKey: 'id',
        });
        Owners.hasOne(models.maintenance_request_management_settings, {
          foreignKey: 'owner_id',
          targetKey: 'id',
        });
        Owners.hasMany(models.user_payment_methods, {
          foreignKey: 'owner_id',
          targetKey: 'id',
        });
        Owners.hasMany(models.referrals, {
          foreignKey: 'referral_owner_id',
          targetKey: 'id',
          as: 'referrals',
        });
        Owners.hasMany(models.referrals, {
          foreignKey: 'advocate_owner_id',
          targetKey: 'id',
          as: 'advocates',
        });
        Owners.hasMany(models.checklists, {
          foreignKey: 'owner_id',
          targetKey: 'id',
          as: 'checklists',
        });
        Owners.hasMany(models.custom_pre_screener_questions, {
          foreignKey: 'owner_id',
          targetKey: 'id',
        });
        Owners.hasMany(models.expenses, {
          foreignKey: 'owner_id',
          targetKey: 'id',
        });
        Owners.hasMany(models.showing_availabilities, {
          foreignKey: 'owner_id',
          targetKey: 'id',
        });
        Owners.hasMany(models.showings, {
          foreignKey: 'owner_id',
          targetKey: 'id',
        });
      };`,
    listings: `Listings.associate = (models) => {
        Listings.belongsTo(models.owners, {
          foreignKey: 'owner_id',
          targetKey: 'id',
        });
        Listings.hasMany(models.photos, {
          foreignKey: 'listing_id',
          sourceKey: 'id',
        });
        Listings.hasMany(models.listing_documents, {
          foreignKey: 'listing_id',
          sourceKey: 'id',
        });
        Listings.hasMany(models.flaggings, {
          foreignKey: 'listing_id',
          sourceKey: 'id',
        });
        Listings.hasMany(models.leases, {
          foreignKey: 'listing_id',
          sourceKey: 'id',
        });
        Listings.hasMany(models.maintenance_request_attachments, {
          foreignKey: 'listing_id',
          sourceKey: 'id',
        });
        Listings.hasMany(models.maintenance_requests, {
          foreignKey: 'listing_id',
          sourceKey: 'id',
        });
        Listings.hasMany(models.rental_requests, {
          foreignKey: 'listing_id',
          sourceKey: 'id',
        });
        Listings.hasMany(models.verification_documents, {
          foreignKey: 'listing_id',
          sourceKey: 'id',
        });
        Listings.hasMany(models.listings, {
          foreignKey: 'parent_listing_id',
          as: 'children_listings',
          sourceKey: 'id',
        });
        Listings.belongsTo(models.listings, {
          foreignKey: 'parent_listing_id',
          as: 'parent_listing',
          targetKey: 'id',
        });
        Listings.belongsTo(models.listings, {
          foreignKey: 'root_listing_id',
          as: 'root_listing',
          targetKey: 'id',
        });
        Listings.hasMany(models.call_forwarding_phone_numbers, {
          foreignKey: 'listing_id',
          sourceKey: 'id',
        });
        Listings.hasMany(models.expenses, {
          foreignKey: 'listing_id',
          sourceKey: 'id',
        });
        Listings.hasOne(models.showing_availabilities, {
          foreignKey: 'listing_id',
          targetKey: 'id',
        });
        Listings.hasMany(models.showings, {
          foreignKey: 'listing_id',
          targetKey: 'id',
        });
      };`,
    leases: `Leases.associate = (models) => {
        Leases.belongsTo(models.listings, {
          foreignKey: 'listing_id',
          targetKey: 'id',
        });
        Leases.hasMany(models.lease_documents, {
          foreignKey: 'lease_id',
          sourceKey: 'id',
        });
        Leases.hasMany(models.wizard_documents, {
          foreignKey: 'lease_id',
          sourceKey: 'id',
        });
        Leases.hasMany(models.signature_requests, {
          foreignKey: 'lease_id',
          sourceKey: 'id',
        });
        Leases.hasMany(models.check_ins, {
          foreignKey: 'lease_id',
          sourceKey: 'id',
        });
        Leases.hasMany(models.lease_agreements, {
          foreignKey: 'lease_id',
          sourceKey: 'id',
        });
        Leases.hasMany(models.maintenance_requests, {
          foreignKey: 'lease_id',
          sourceKey: 'id',
        });
        Leases.hasMany(models.payment_request_rules, {
          foreignKey: 'lease_id',
          sourceKey: 'id',
        });
        Leases.hasMany(models.payment_requests, {
          foreignKey: 'lease_id',
          sourceKey: 'id',
        });
        Leases.belongsToMany(models.renters, {
          through: 'leases_renters',
          foreignKey: 'lease_id',
        });
        Leases.hasMany(models.checklists, {
          foreignKey: 'lease_id',
          sourceKey: 'id',
        });
      };`,
    leases_renters: ``
}