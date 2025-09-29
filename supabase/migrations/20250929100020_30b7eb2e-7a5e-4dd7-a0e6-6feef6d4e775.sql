-- Mise à jour du compte admin avec un mot de passe simple
UPDATE admin_users 
SET password_hash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' -- password = "password"
WHERE email = 'admin@uae-visa.com';