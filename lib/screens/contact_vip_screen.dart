// =========================================================================
// JARDINS DE BALI — TAB 4: CONTACT VIP, PLANS CAD AMA & CONCIERGE IA
// 1-Click WhatsApp, Direct Phone, Plans Architecturaux AMA, Brochures & FAQ
// =========================================================================

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/app_models.dart';
import '../state/app_state.dart';
import '../theme/imperial_theme.dart';
import 'auth_screen.dart';

class ContactVipScreen extends StatefulWidget {
  final AppState appState;

  const ContactVipScreen({super.key, required this.appState});

  @override
  State<ContactVipScreen> createState() => _ContactVipScreenState();
}

class _ContactVipScreenState extends State<ContactVipScreen> {
  int _activeSubTab = 0; // 0 = Contact VIP, 1 = Brochures & FAQ

  // AI Concierge Chat state
  final TextEditingController _aiQuestionController = TextEditingController();
  final List<({bool isUser, String message})> _chatMessages = [
    (
      isUser: false,
      message:
          'Marhaban bikoum ! Je suis votre Concierge Privé officiel des Jardins de Bali Marrakech. Posez-moi vos questions sur le statut d\'acquisition pour non-résidents (sans VNA), les échéanciers de paiement VEFA, le rendement locatif ou nos 230 résidences.',
    ),
  ];

  // Lead Form State
  final _formKey = GlobalKey<FormState>();
  String _firstName = '';
  String _lastName = '';
  String _phone = '';
  String _email = '';
  String _typology = '2 Chambres (70-95 m²)';
  String _purpose = 'Investissement Locatif à Fort Rendement (RBNB / Saisonnier)';
  String _notes = '';

  @override
  void dispose() {
    _aiQuestionController.dispose();
    super.dispose();
  }

  void _sendAiQuestion([String? presetText]) {
    final text = presetText ?? _aiQuestionController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _chatMessages.add((isUser: true, message: text));
      _aiQuestionController.clear();
    });

    final answer = widget.appState.askConcierge(text);

    Future.delayed(const Duration(milliseconds: 400), () {
      if (mounted) {
        setState(() {
          _chatMessages.add((isUser: false, message: answer));
        });
      }
    });
  }

  Future<void> _launchWhatsApp() async {
    final uri = Uri.parse(
      'https://wa.me/212665644391?text=${Uri.encodeComponent("Bonjour BaytImmo Prestige, je souhaite échanger avec un conseiller pour le projet Jardins de Bali Menara Marrakech.")}',
    );
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  Future<void> _launchPhoneCall() async {
    final uri = Uri.parse('tel:+212665644391');
    await launchUrl(uri);
  }

  Future<void> _launchEmail() async {
    final uri = Uri.parse('mailto:contact@bayt-immo.com?subject=Information%20Jardins%20de%20Bali%20Marrakech');
    await launchUrl(uri);
  }

  Future<void> _launchGoogleMaps(String url) async {
    const exactProjectUrl =
        'https://www.google.com/maps/place/31.628587,-8.036180/@31.628587,-8.036180,18z';
    final uri = Uri.parse(url.isNotEmpty ? url : exactProjectUrl);
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  void _submitLeadForm() {
    if (_formKey.currentState?.validate() ?? false) {
      _formKey.currentState?.save();
      final summary =
          'Bonjour BaytImmo,\nJe suis $_firstName $_lastName ($_phone - $_email).\nJe recherche : $_typology.\nProjet : $_purpose.\nNotes : $_notes';
      final uri = Uri.parse('https://wa.me/212665644391?text=${Uri.encodeComponent(summary)}');
      launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: widget.appState,
      builder: (context, _) {
        final bundle = widget.appState.bundle;
        if (bundle == null) return const SizedBox.shrink();

        final agency = bundle.contact;
        final project = bundle.project;

        return Column(
      children: [
        // Ultra-Luxury Architectural Header (without the glowing circle dot)
        Container(
          width: double.infinity,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Color(0xFF0A0E09),
                Color(0xFF131A12),
              ],
            ),
            border: Border(
              bottom: BorderSide(
                color: const Color(0xFFC5A880).withValues(alpha: 0.22),
                width: 1,
              ),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.22),
                blurRadius: 18,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
          child: SafeArea(
            bottom: false,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Prestige Badge Row
                Text(
                  'BAYTIMMO PRESTIGE • MENARA',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 9.5,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 2.2,
                    color: const Color(0xFFDFBA73),
                  ),
                ),
                const SizedBox(height: 7),
                Text(
                  'Contact VIP & Brochures',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 21.5,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                    letterSpacing: -0.2,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  'Bureau de Vente Menara • Quartier Rahham, Lot B5',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFFA5B0A2),
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 14),
                // Modern Capsule Subtab Switcher
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(
                    children: [
                      _subTab(0, Icons.headset_mic_rounded, 'Contact VIP'),
                      const SizedBox(width: 8),
                      _subTab(1, Icons.menu_book_rounded, 'Brochures & FAQ'),
                      const SizedBox(width: 8),
                      MouseRegion(
                        cursor: SystemMouseCursors.click,
                        child: GestureDetector(
                          onTap: () => AuthScreen.openPortal(context, widget.appState),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8.5),
                            decoration: BoxDecoration(
                              color: const Color(0xFFDFBA73).withValues(alpha: 0.14),
                              borderRadius: BorderRadius.circular(22),
                              border: Border.all(
                                color: const Color(0xFFDFBA73).withValues(alpha: 0.45),
                                width: 1,
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  widget.appState.isAdmin
                                      ? Icons.admin_panel_settings_rounded
                                      : Icons.verified_user_outlined,
                                  size: 14,
                                  color: const Color(0xFFDFBA73),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  widget.appState.isLoggedIn
                                      ? (widget.appState.isAdmin ? 'Admin' : 'Mon Dossier')
                                      : 'Espace Client',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 11.5,
                                    fontWeight: FontWeight.w700,
                                    color: const Color(0xFFEFD39B),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),

        // Body Content
        Expanded(
          child: _activeSubTab == 0
              ? _buildContactFormTab(agency, project)
              : _buildBrochuresFaqTab(bundle),
        ),
      ],
        );
      },
    );
  }

  Widget _subTab(int index, IconData icon, String label) {
    final isSelected = _activeSubTab == index;
    return GestureDetector(
      onTap: () {
        HapticFeedback.lightImpact();
        setState(() => _activeSubTab = index);
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 240),
        curve: Curves.easeOutCubic,
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8.5),
        decoration: BoxDecoration(
          gradient: isSelected
              ? const LinearGradient(
                  colors: [
                    Color(0xFFE8CC95),
                    Color(0xFFC5A880),
                    Color(0xFFA58557),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                )
              : null,
          color: isSelected ? null : Colors.white.withValues(alpha: 0.06),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(
            color: isSelected
                ? const Color(0xFFFFE8B8).withValues(alpha: 0.8)
                : Colors.white.withValues(alpha: 0.1),
            width: 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: const Color(0xFFC5A880).withValues(alpha: 0.45),
                    blurRadius: 12,
                    offset: const Offset(0, 3),
                  ),
                ]
              : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 14,
              color: isSelected ? const Color(0xFF0D120C) : const Color(0xFFDFBA73),
            ),
            const SizedBox(width: 6),
            Text(
              label,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 11.5,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                color: isSelected ? const Color(0xFF0D120C) : Colors.white.withValues(alpha: 0.9),
                letterSpacing: 0.2,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // SUBTAB 0: CONTACT FORM & VIP HOTLINE (HARMONIZED WARM ALABASTER LUXURY)
  Widget _buildContactFormTab(ContactLeads agency, ProjectInfo project) {
    return Container(
      color: ImperialColors.background,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 150),
        children: [
          // 1. White Alabaster Bureau de Vente Card with Private Concierge Badge
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFEAE5DA), width: 1),
              boxShadow: ImperialTheme.modernCardShadow,
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'BUREAU DE VENTE',
                        style: GoogleFonts.playfairDisplay(
                          fontSize: 16.5,
                          fontWeight: FontWeight.w800,
                          color: const Color(0xFF111710),
                          letterSpacing: 0.5,
                        ),
                      ),
                      const SizedBox(height: 6),
                      // Private Concierge Pill Badge
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFC5A880).withValues(alpha: 0.18),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: const Color(0xFFC5A880).withValues(alpha: 0.35),
                            width: 0.8,
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.person_outline_rounded, size: 12, color: Color(0xFF6E5331)),
                            const SizedBox(width: 5),
                            Text(
                              'Private Concierge',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 10.5,
                                fontWeight: FontWeight.w700,
                                color: const Color(0xFF5A442A),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 10),
                      InkWell(
                        onTap: () => _launchGoogleMaps(project.location.googleMapsUrl),
                        borderRadius: BorderRadius.circular(6),
                        child: Text(
                          agency.address,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 12,
                            color: const Color(0xFF555E53),
                            height: 1.4,
                          ),
                        ),
                      ),
                      const SizedBox(height: 4),
                      InkWell(
                        onTap: _launchPhoneCall,
                        borderRadius: BorderRadius.circular(6),
                        child: Text(
                          'Contact direct: +212 6 65 64 43 91',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w600,
                            color: const Color(0xFF1E261D),
                          ),
                        ),
                      ),
                      const SizedBox(height: 3),
                      InkWell(
                        onTap: _launchEmail,
                        child: Text(
                          'Email: ${agency.email}',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w600,
                            color: const Color(0xFF8C6D42),
                            decoration: TextDecoration.underline,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                // Interactive Real Satellite Mini Map Thumbnail (Opens Google Maps at Lot B5 Rahham)
                Tooltip(
                  message: 'Ouvrir Lot B5 Quartier Rahham dans Google Maps',
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () => _launchGoogleMaps(project.location.googleMapsUrl),
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        width: 90,
                        height: 90,
                        decoration: BoxDecoration(
                          color: const Color(0xFFF2EFE9),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFC5A880), width: 1.4),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.08),
                              blurRadius: 8,
                              offset: const Offset(0, 3),
                            ),
                          ],
                        ),
                        clipBehavior: Clip.antiAlias,
                        child: Stack(
                          fit: StackFit.expand,
                          alignment: Alignment.center,
                          children: [
                            // Real Satellite Situation Plan of Lot B5 (Quartier Rahham, Menara)
                            const SmartAssetImage(
                              localPath:
                                  '02_PLANS_ARCHITECTURAUX/Facades_Et_Coupes/plan_21_plan_de_situation_satellite.jpg',
                              fit: BoxFit.cover,
                            ),
                            // Subtle dark vignette for pin contrast
                            Container(
                              color: Colors.black.withValues(alpha: 0.15),
                            ),
                            // Gold Pin on Parcel B5
                            const Positioned(
                              top: 16,
                              child: Icon(
                                Icons.location_on_rounded,
                                size: 28,
                                color: Color(0xFFDFBA73),
                                shadows: [
                                  Shadow(
                                    color: Colors.black87,
                                    blurRadius: 6,
                                  ),
                                ],
                              ),
                            ),
                            // Bottom "LOT B5 • MAPS" Pill
                            Positioned(
                              left: 5,
                              right: 5,
                              bottom: 5,
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 3),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF131A12).withValues(alpha: 0.92),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: const Color(0xFFC5A880).withValues(alpha: 0.5),
                                    width: 0.7,
                                  ),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Icon(Icons.near_me_rounded, size: 9, color: Color(0xFFDFBA73)),
                                    const SizedBox(width: 3),
                                    Text(
                                      'LOT B5 • MAPS',
                                      style: GoogleFonts.plusJakartaSans(
                                        fontSize: 7.5,
                                        fontWeight: FontWeight.w800,
                                        letterSpacing: 0.4,
                                        color: const Color(0xFFDFBA73),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // 3. Trajets & Accès (Refined Alabaster Card)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFEAE5DA), width: 1),
              boxShadow: ImperialTheme.modernCardShadow,
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Icon(Icons.flight_takeoff_rounded, size: 16, color: Color(0xFF9E8055)),
                    Text(
                      'Aéroport Menara (RAK) — 5 min',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 12.5,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF1E261D),
                      ),
                    ),
                    const Icon(Icons.flight_land_rounded, size: 16, color: Color(0xFF9E8055)),
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 9),
                  child: Container(
                    height: 1,
                    color: const Color(0xFFEBE7DD),
                  ),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Icon(Icons.park_outlined, size: 16, color: Color(0xFF9E8055)),
                    Text(
                      'Jardins de la Ménara — 3 min',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 12.5,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF1E261D),
                      ),
                    ),
                    const Icon(Icons.nature_people_outlined, size: 16, color: Color(0xFF9E8055)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // 4. White Card Container for "Votre Demande VIP"
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFEAE5DA), width: 1),
              boxShadow: ImperialTheme.modernCardShadow,
            ),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Votre Demande VIP',
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 18.5,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF111710),
                      letterSpacing: 0.3,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Recevez le dossier de présentation avec les disponibilités actuelles.',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11.5,
                      color: const Color(0xFF555E53),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Nom Complet Row
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Prénom *',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: const Color(0xFF4A5447),
                              ),
                            ),
                            const SizedBox(height: 5),
                            TextFormField(
                              style: const TextStyle(color: Color(0xFF111710), fontSize: 13),
                              decoration: _luxuryInputDecoration('Karim'),
                              validator: (v) => v!.isEmpty ? 'Requis' : null,
                              onSaved: (v) => _firstName = v ?? '',
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Nom *',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: const Color(0xFF4A5447),
                              ),
                            ),
                            const SizedBox(height: 5),
                            TextFormField(
                              style: const TextStyle(color: Color(0xFF111710), fontSize: 13),
                              decoration: _luxuryInputDecoration('Benjelloun'),
                              validator: (v) => v!.isEmpty ? 'Requis' : null,
                              onSaved: (v) => _lastName = v ?? '',
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Téléphone / WhatsApp
                  Text(
                    'Téléphone / WhatsApp *',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF4A5447),
                    ),
                  ),
                  const SizedBox(height: 5),
                  TextFormField(
                    keyboardType: TextInputType.phone,
                    style: const TextStyle(color: Color(0xFF111710), fontSize: 13),
                    decoration: _luxuryInputDecoration('+212 6 XX XX XX XX'),
                    validator: (v) => v!.isEmpty ? 'Requis' : null,
                    onSaved: (v) => _phone = v ?? '',
                  ),
                  const SizedBox(height: 12),

                  // Email
                  Text(
                    'Adresse Email *',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF4A5447),
                    ),
                  ),
                  const SizedBox(height: 5),
                  TextFormField(
                    keyboardType: TextInputType.emailAddress,
                    style: const TextStyle(color: Color(0xFF111710), fontSize: 13),
                    decoration: _luxuryInputDecoration('contact@exemple.com'),
                    validator: (v) => v!.isEmpty ? 'Requis' : null,
                    onSaved: (v) => _email = v ?? '',
                  ),
                  const SizedBox(height: 12),

                  // Typologie Dropdown
                  Text(
                    'Typologie Souhaitée',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF4A5447),
                    ),
                  ),
                  const SizedBox(height: 5),
                  DropdownButtonFormField<String>(
                    initialValue: _typology,
                    dropdownColor: Colors.white,
                    style: const TextStyle(color: Color(0xFF111710), fontSize: 12.5),
                    decoration: _luxuryInputDecoration(null),
                    items: [
                      'Duplex RDC & Mezzanine (61-124 m² + Terrasse)',
                      '1 Chambre (38-55 m²)',
                      '2 Chambres (70-95 m²)',
                      '3 Chambres (83-108 m²)',
                      'Magasin Flagship en Façade',
                    ]
                        .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                        .toList(),
                    onChanged: (v) => setState(() => _typology = v ?? _typology),
                    onSaved: (v) => _typology = v ?? _typology,
                  ),
                  const SizedBox(height: 12),

                  // Message Notes
                  Text(
                    'Message / Date souhaitée',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF4A5447),
                    ),
                  ),
                  const SizedBox(height: 5),
                  TextFormField(
                    maxLines: 2,
                    style: const TextStyle(color: Color(0xFF111710), fontSize: 13),
                    decoration: _luxuryInputDecoration('Précisez votre demande ou vos disponibilités...'),
                    onSaved: (v) => _notes = v ?? '',
                  ),
                  const SizedBox(height: 20),

                  // 5. Glowing Champagne Gold Gradient CTA Button
                  Container(
                    width: double.infinity,
                    height: 54,
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
                          color: const Color(0xFFC5A880).withValues(alpha: 0.45),
                          blurRadius: 18,
                          offset: const Offset(0, 5),
                        ),
                      ],
                      border: Border.all(
                        color: const Color(0xFFFFE8B8).withValues(alpha: 0.7),
                        width: 1,
                      ),
                    ),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        borderRadius: BorderRadius.circular(26),
                        onTap: _submitLeadForm,
                        child: Center(
                          child: Text(
                            'CONFIRMER MA DEMANDE VIP',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 13,
                              fontWeight: FontWeight.w800,
                              color: const Color(0xFF0D120C),
                              letterSpacing: 1.2,
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
    );
  }

  InputDecoration _luxuryInputDecoration(String? hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: GoogleFonts.plusJakartaSans(
        color: const Color(0xFF8F998C),
        fontSize: 12.5,
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      filled: true,
      fillColor: const Color(0xFFF7F5EF),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(
          color: Color(0xFFE2DDD1),
          width: 0.9,
        ),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(
          color: Color(0xFFE2DDD1),
          width: 0.9,
        ),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(
          color: Color(0xFFC5A880),
          width: 1.4,
        ),
      ),
    );
  }

  // SUBTAB 1: BROCHURES & FAQ (ULTRA-LUXURY & CONFIDENTIALITY PROTECTED)
  Widget _buildBrochuresFaqTab(FullAppBundle bundle) {
    final publicPdfs = [
      (
        title: 'Dossier Complet — Jardins de Bali Menara',
        desc: 'Brochure officielle de vente de prestige, plans d\'étages et finitions',
        file: 'assets/05_DOCUMENTS_ET_BROCHURES_PDF/Dossier_Jardins_de_Bali.pdf',
        badge: 'OFFICIEL BAYTIMMO',
      ),
      (
        title: 'Livre Blanc d\'Architecture Contemporaine',
        desc: 'Conception bioclimatique et signatures Cabinet AMA Architecture',
        file: 'assets/05_DOCUMENTS_ET_BROCHURES_PDF/Dossier_Jardins_de_Bali_Architecture.pdf',
        badge: 'CABINET AMA',
      ),
    ];

    return Container(
      color: ImperialColors.background,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 150),
        children: [
          // Section Header: Brochures
          Row(
            children: [
              Container(
                width: 5,
                height: 18,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFDFBA73), Color(0xFFA58557)],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'DOCUMENTATION OFFICIELLE',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.8,
                      color: const Color(0xFF8C6D42),
                    ),
                  ),
                  Text(
                    'Brochures & Dossiers de Vente',
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 17,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF111710),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Public Official Brochures
          ...publicPdfs.map((pdf) {
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: const Color(0xFFEAE5DA), width: 1),
                boxShadow: ImperialTheme.modernCardShadow,
              ),
              child: Row(
                children: [
                  // Gold/Dark Icon Capsule
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: const Color(0xFF131A12),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: const Color(0xFFC5A880).withValues(alpha: 0.4),
                        width: 1,
                      ),
                    ),
                    child: const Icon(Icons.picture_as_pdf_rounded, color: Color(0xFFDFBA73), size: 22),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
                          decoration: BoxDecoration(
                            color: const Color(0xFFC5A880).withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            pdf.badge,
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 8.5,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 1.0,
                              color: const Color(0xFF8C6D42),
                            ),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          pdf.title,
                          style: GoogleFonts.playfairDisplay(
                            fontSize: 14.5,
                            fontWeight: FontWeight.w700,
                            color: const Color(0xFF111710),
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          pdf.desc,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 11,
                            color: const Color(0xFF555E53),
                            height: 1.35,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  // Download Action Button
                  InkWell(
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          backgroundColor: const Color(0xFF131A12),
                          content: Text(
                            'Téléchargement de la brochure : ${pdf.title}',
                            style: const TextStyle(color: Color(0xFFDFBA73)),
                          ),
                        ),
                      );
                    },
                    borderRadius: BorderRadius.circular(14),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF7F5EF),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFE2DDD1)),
                      ),
                      child: const Icon(Icons.download_rounded, color: Color(0xFF8C6D42), size: 20),
                    ),
                  ),
                ],
              ),
            );
          }),

          const SizedBox(height: 12),

          // Section Header: FAQ
          Row(
            children: [
              Container(
                width: 5,
                height: 18,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFDFBA73), Color(0xFFA58557)],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'GUIDE JURIDIQUE & VEFA',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.8,
                      color: const Color(0xFF8C6D42),
                    ),
                  ),
                  Text(
                    'Questions Fréquentes des Acquéreurs',
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 17,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF111710),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),

          // FAQ Accordion Cards
          ...bundle.faq.map((item) {
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: const Color(0xFFEAE5DA), width: 1),
                boxShadow: ImperialTheme.modernCardShadow,
              ),
              child: Theme(
                data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                child: ExpansionTile(
                  iconColor: const Color(0xFF8C6D42),
                  collapsedIconColor: const Color(0xFF9E8055),
                  leading: Container(
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(
                      color: const Color(0xFFC5A880).withValues(alpha: 0.15),
                      shape: BoxShape.circle,
                    ),
                    child: const Center(
                      child: Text(
                        '?',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF8C6D42),
                        ),
                      ),
                    ),
                  ),
                  title: Text(
                    item.question,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF141A13),
                    ),
                  ),
                  children: [
                    Container(
                      margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFBF9F4),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFEAE5DA)),
                      ),
                      child: Text(
                        item.answer,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12,
                          color: const Color(0xFF4A5447),
                          height: 1.55,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  // SUBTAB 3: AI CONCIERGE CHAT
  Widget _buildAiConciergeTab() {
    final promptChips = [
      'Un étranger peut-il acheter sans VNA ?',
      'Comment fonctionne l\'échéancier VEFA ?',
      'Quel est le rendement locatif moyen ?',
      'Quelles sont les prestations 5 étoiles ?',
      'Y a-t-il des commerces à vendre ?',
    ];

    return Column(
      children: [
        // Quick questions bar
        Container(
          color: ImperialColors.surface,
          padding: const EdgeInsets.symmetric(vertical: 10),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: promptChips.map((chip) {
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ActionChip(
                    backgroundColor: ImperialColors.surfaceVariant,
                    side: BorderSide.none,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    label: Text(
                      chip,
                      style: ImperialTheme.bodyStyle(fontSize: 11.5, fontWeight: FontWeight.w600),
                    ),
                    onPressed: () => _sendAiQuestion(chip),
                  ),
                );
              }).toList(),
            ),
          ),
        ),
        // Chat messages list
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
            itemCount: _chatMessages.length,
            itemBuilder: (context, index) {
              final msg = _chatMessages[index];
              return Align(
                alignment: msg.isUser ? Alignment.centerRight : Alignment.centerLeft,
                child: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
                  constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
                  decoration: BoxDecoration(
                    color: msg.isUser ? ImperialColors.primary : ImperialColors.surface,
                    borderRadius: BorderRadius.circular(18).copyWith(
                      bottomRight: msg.isUser ? const Radius.circular(2) : null,
                      bottomLeft: !msg.isUser ? const Radius.circular(2) : null,
                    ),
                    boxShadow: ImperialTheme.modernCardShadow,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (!msg.isUser)
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.auto_awesome, color: ImperialColors.accentDark, size: 14),
                            const SizedBox(width: 5),
                            Text(
                              'CONCIERGE PRIVÉ JARDINS DE BALI',
                              style: ImperialTheme.bodyStyle(
                                fontSize: 9.5,
                                fontWeight: FontWeight.w700,
                                color: ImperialColors.accentDark,
                                letterSpacing: 0.6,
                              ),
                            ),
                          ],
                        ),
                      if (!msg.isUser) const SizedBox(height: 5),
                      Text(
                        msg.message,
                        style: ImperialTheme.bodyStyle(
                          fontSize: 13,
                          color: msg.isUser ? Colors.white : ImperialColors.textPrimary,
                          height: 1.45,
                        ),
                      ),
                    ],
                  ),
                ),
              ).animate().fadeIn(duration: 250.ms);
            },
          ),
        ),
        // Question Input Box
        Container(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 120),
          decoration: const BoxDecoration(
            color: ImperialColors.surface,
          ),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _aiQuestionController,
                  onSubmitted: (_) => _sendAiQuestion(),
                  decoration: InputDecoration(
                    hintText: 'Posez votre question à l\'assistant...',
                    hintStyle: ImperialTheme.bodyStyle(fontSize: 12.5, color: ImperialColors.textMuted),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    filled: true,
                    fillColor: ImperialColors.surfaceVariant,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                style: IconButton.styleFrom(
                  backgroundColor: ImperialColors.primary,
                  foregroundColor: ImperialColors.accent,
                ),
                icon: const Icon(Icons.send_rounded),
                onPressed: () => _sendAiQuestion(),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
