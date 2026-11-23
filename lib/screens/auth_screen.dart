// =========================================================================
// JARDINS DE BALI — LUXURY VIP AUTHENTICATION SCREEN (CLIENT & ADMIN)
// Connexion / Inscription + 1-Tap Demo Credentials for Instant Review
// =========================================================================

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../state/app_state.dart';
import '../theme/imperial_theme.dart';
import 'admin_dashboard_screen.dart';
import 'client_portal_screen.dart';

class AuthScreen extends StatefulWidget {
  final AppState appState;

  const AuthScreen({super.key, required this.appState});

  /// Opens the right portal directly if already logged in, otherwise AuthScreen.
  static Future<void> openPortal(BuildContext context, AppState appState) {
    Widget destination;
    if (appState.isLoggedIn) {
      destination = appState.isAdmin
          ? AdminDashboardScreen(appState: appState)
          : ClientPortalScreen(appState: appState);
    } else {
      destination = AuthScreen(appState: appState);
    }
    return Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => destination),
    );
  }

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool _isLogin = true;
  bool _obscurePassword = true;
  bool _submitting = false;

  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  void _fillDemo(String email, String password) {
    HapticFeedback.selectionClick();
    setState(() {
      _isLogin = true;
      _emailCtrl.text = email;
      _passwordCtrl.text = password;
    });
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    setState(() => _submitting = true);

    bool ok;
    if (_isLogin) {
      ok = await widget.appState.login(_emailCtrl.text, _passwordCtrl.text);
    } else {
      ok = await widget.appState.register(
        name: _nameCtrl.text,
        email: _emailCtrl.text,
        phone: _phoneCtrl.text,
        password: _passwordCtrl.text,
      );
    }

    if (!mounted) return;
    setState(() => _submitting = false);

    if (ok) {
      final dest = widget.appState.isAdmin
          ? AdminDashboardScreen(appState: widget.appState)
          : ClientPortalScreen(appState: widget.appState);
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => dest),
      );
    } else {
      final err = widget.appState.lastAuthError ?? 'Échec de l\'authentification.';
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: const Color(0xFF2B1412),
          behavior: SnackBarBehavior.floating,
          content: Text(
            err,
            style: GoogleFonts.plusJakartaSans(
              color: Colors.white,
              fontSize: 12.5,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ImperialColors.background,
      body: Column(
        children: [
          // Ultra-Luxury Dark Obsidian Header
          Container(
            width: double.infinity,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFF0A0E09), Color(0xFF141C13)],
              ),
              border: Border(
                bottom: BorderSide(
                  color: const Color(0xFFC5A880).withValues(alpha: 0.25),
                ),
              ),
            ),
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
            child: SafeArea(
              bottom: false,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      GestureDetector(
                        onTap: () => Navigator.of(context).pop(),
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.08),
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.14),
                            ),
                          ),
                          child: const Icon(
                            Icons.arrow_back_ios_new_rounded,
                            size: 16,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      Text(
                        'BAYTIMMO PRESTIGE • ESPACE VIP',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 9.5,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 2.0,
                          color: const Color(0xFFDFBA73),
                        ),
                      ),
                      const SizedBox(width: 34),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    _isLogin ? 'Espace Privé BaytImmo' : 'Créer votre Compte VIP',
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _isLogin
                        ? 'Accédez à votre dossier personnel, vos visites privées et votre suivi VEFA.'
                        : 'Inscrivez-vous pour réserver une visite VIP, simuler votre financement et sauvegarder vos coups de cœur.',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11.5,
                      color: const Color(0xFFA5B0A2),
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Mode Switcher
                  Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.06),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.1),
                      ),
                    ),
                    child: Row(
                      children: [
                        _modeTab('Connexion', _isLogin, () {
                          setState(() => _isLogin = true);
                        }),
                        _modeTab('Inscription', !_isLogin, () {
                          setState(() => _isLogin = false);
                        }),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Body Form
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(16, 18, 16, 40),
              children: [
                // Quick 1-Tap Demo Access Card
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF6F1E6),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(
                      color: const Color(0xFFC5A880).withValues(alpha: 0.45),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(
                            Icons.verified_user_rounded,
                            size: 16,
                            color: Color(0xFF8C6D42),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            'ACCÈS DÉMO INSTANTANÉ',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 10,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 1.3,
                              color: const Color(0xFF6E5331),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: _demoPill(
                              icon: Icons.home_rounded,
                              title: 'Propriétaire',
                              subtitle: 'APP 1 • 40%',
                              onTap: () => _fillDemo('karim@client.ma', 'client123'),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: _demoPill(
                              icon: Icons.person_outline_rounded,
                              title: 'Prospect',
                              subtitle: 'RDV & Sim.',
                              onTap: () => _fillDemo('salma@client.ma', 'client123'),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: _demoPill(
                              icon: Icons.admin_panel_settings_rounded,
                              title: 'Promoteur',
                              subtitle: 'Dashboard',
                              onTap: () => _fillDemo('admin@bayt-immo.com', 'admin123'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Main Alabaster Card Form
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: const Color(0xFFEAE5DA)),
                    boxShadow: ImperialTheme.modernCardShadow,
                  ),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (!_isLogin) ...[
                          _label('Nom Complet *'),
                          TextFormField(
                            controller: _nameCtrl,
                            decoration: _inputDeco('Ex: Karim Benjelloun', Icons.person_outline_rounded),
                            validator: (v) =>
                                (!_isLogin && (v == null || v.trim().isEmpty)) ? 'Nom requis' : null,
                          ),
                          const SizedBox(height: 14),
                          _label('Téléphone / WhatsApp *'),
                          TextFormField(
                            controller: _phoneCtrl,
                            keyboardType: TextInputType.phone,
                            decoration: _inputDeco('+212 6 XX XX XX XX', Icons.phone_outlined),
                            validator: (v) =>
                                (!_isLogin && (v == null || v.trim().isEmpty)) ? 'Téléphone requis' : null,
                          ),
                          const SizedBox(height: 14),
                        ],
                        _label('Adresse Email *'),
                        TextFormField(
                          controller: _emailCtrl,
                          keyboardType: TextInputType.emailAddress,
                          decoration: _inputDeco('nom@exemple.com', Icons.mail_outline_rounded),
                          validator: (v) {
                            if (v == null || v.trim().isEmpty) return 'Email requis';
                            if (!v.contains('@')) return 'Email invalide';
                            return null;
                          },
                        ),
                        const SizedBox(height: 14),
                        _label('Mot de Passe *'),
                        TextFormField(
                          controller: _passwordCtrl,
                          obscureText: _obscurePassword,
                          onFieldSubmitted: (_) => _submit(),
                          decoration: _inputDeco('••••••••', Icons.lock_outline_rounded).copyWith(
                            suffixIcon: IconButton(
                              icon: Icon(
                                _obscurePassword
                                    ? Icons.visibility_outlined
                                    : Icons.visibility_off_outlined,
                                size: 18,
                                color: const Color(0xFF7D857A),
                              ),
                              onPressed: () =>
                                  setState(() => _obscurePassword = !_obscurePassword),
                            ),
                          ),
                          validator: (v) =>
                              (v == null || v.trim().length < 4) ? 'Min. 4 caractères' : null,
                        ),
                        const SizedBox(height: 22),

                        // Gold Gradient Submit Button
                        Container(
                          width: double.infinity,
                          height: 52,
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [
                                Color(0xFFE8CC95),
                                Color(0xFFC5A880),
                                Color(0xFFA58557),
                              ],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(26),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFFC5A880).withValues(alpha: 0.4),
                                blurRadius: 14,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Material(
                            color: Colors.transparent,
                            child: InkWell(
                              borderRadius: BorderRadius.circular(26),
                              onTap: _submitting ? null : _submit,
                              child: Center(
                                child: _submitting
                                    ? const SizedBox(
                                        width: 20,
                                        height: 20,
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2,
                                          color: Color(0xFF0D120C),
                                        ),
                                      )
                                    : Text(
                                        _isLogin ? 'ACCÉDER À MON ESPACE' : 'CRÉER MON COMPTE VIP',
                                        style: GoogleFonts.plusJakartaSans(
                                          fontSize: 12.5,
                                          fontWeight: FontWeight.w800,
                                          letterSpacing: 1.1,
                                          color: const Color(0xFF0D120C),
                                        ),
                                      ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _modeTab(String label, bool active, VoidCallback onTap) {
    return Expanded(
      child: GestureDetector(
        onTap: () {
          HapticFeedback.selectionClick();
          onTap();
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 220),
          padding: const EdgeInsets.symmetric(vertical: 9),
          decoration: BoxDecoration(
            gradient: active
                ? const LinearGradient(
                    colors: [Color(0xFFE8CC95), Color(0xFFC5A880)],
                  )
                : null,
            borderRadius: BorderRadius.circular(14),
          ),
          child: Center(
            child: Text(
              label,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 12,
                fontWeight: active ? FontWeight.w800 : FontWeight.w600,
                color: active ? const Color(0xFF0E140D) : Colors.white70,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _demoPill({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFE2D8C7)),
        ),
        child: Row(
          children: [
            Icon(icon, size: 17, color: const Color(0xFF8C6D42)),
            const SizedBox(width: 7),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: const Color(0xFF141A13),
                    ),
                  ),
                  Text(
                    subtitle,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 9.5,
                      color: const Color(0xFF6B7368),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _label(String text) => Padding(
        padding: const EdgeInsets.only(bottom: 6),
        child: Text(
          text,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 11,
            fontWeight: FontWeight.w700,
            color: const Color(0xFF434C41),
          ),
        ),
      );

  InputDecoration _inputDeco(String hint, IconData icon) => InputDecoration(
        hintText: hint,
        hintStyle: GoogleFonts.plusJakartaSans(
          fontSize: 12.5,
          color: const Color(0xFF939C90),
        ),
        prefixIcon: Icon(icon, size: 18, color: const Color(0xFF9E8055)),
        filled: true,
        fillColor: const Color(0xFFF7F5EF),
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0xFFE2DDD1)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0xFFE2DDD1)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0xFFC5A880), width: 1.4),
        ),
      );
}
