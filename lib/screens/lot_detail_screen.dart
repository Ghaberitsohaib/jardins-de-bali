// =========================================================================
// JARDINS DE BALI — LOT DETAIL SCREEN (PRESENTATION & DEFINITION DU LOT)
// PRIX SUR DEMANDE • PLAN 2D PINCH-TO-ZOOM • ECHEANCIER VEFA LEGAL • WHATSAPP
// =========================================================================

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/app_models.dart';
import '../services/pdf_document_service.dart';
import '../state/app_state.dart';
import '../theme/imperial_theme.dart';

class LotDetailScreen extends StatefulWidget {
  final ResidenceLot lot;
  final AppState appState;

  const LotDetailScreen({
    super.key,
    required this.lot,
    required this.appState,
  });

  @override
  State<LotDetailScreen> createState() => _LotDetailScreenState();
}

class _LotDetailScreenState extends State<LotDetailScreen> {
  int _currentImageIndex = 0;
  int _activeTab = 0; // 0 = Plan 2D, 1 = Échéancier VEFA (%), 2 = Prestations & Finitions
  int _selectedVefaStep = 0;
  final PageController _pageController = PageController();
  final TransformationController _planZoomController = TransformationController();

  @override
  void dispose() {
    _pageController.dispose();
    _planZoomController.dispose();
    super.dispose();
  }

  List<GalleryItem> get _galleryItems {
    if (widget.lot.assets.gallery.isNotEmpty) {
      return widget.lot.assets.gallery;
    }
    return [
      GalleryItem(
        localPath: widget.lot.assets.thumbLocalPath,
        remoteUrl: widget.lot.assets.thumbRemoteUrl,
      ),
    ];
  }

  Future<void> _launchWhatsAppInquiry() async {
    final lot = widget.lot;
    final msg = Uri.encodeComponent(
      'Bonjour BaytImmo, je m\'intéresse au lot ${lot.title} (${lot.category} - ${lot.surfaceFormatted} au ${lot.floorName}). Pouvez-vous me communiquer les disponibilités et les conditions de réservation ?',
    );
    final uri = Uri.parse('https://wa.me/212665644391?text=$msg');
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Impossible d\'ouvrir WhatsApp.')),
        );
      }
    }
  }

  Future<void> _launchPhoneCall() async {
    final uri = Uri.parse('tel:+212665644391');
    await launchUrl(uri);
  }

  void _openFullScreenPlan() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (ctx) => Scaffold(
          backgroundColor: ImperialColors.primary,
          appBar: AppBar(
            backgroundColor: ImperialColors.primary,
            title: Text(
              'PLAN 2D — ${widget.lot.id} (${widget.lot.floorName})',
              style: ImperialTheme.displayStyle(
                fontSize: 15,
                color: ImperialColors.accent,
              ),
            ),
          ),
          body: InteractiveViewer(
            minScale: 0.8,
            maxScale: 5.0,
            child: Center(
              child: SmartAssetImage(
                localPath: widget.lot.assets.planLocalPath,
                remoteUrl: widget.lot.assets.planRemoteUrl,
                fit: BoxFit.contain,
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: widget.appState,
      builder: (context, _) {
        final lot = widget.lot;
        final isFav = widget.appState.isFavorite(lot.id);
        final isComp = widget.appState.isCompared(lot.id);
        final gallery = _galleryItems;

        return Scaffold(
          backgroundColor: ImperialColors.background,
          body: Stack(
            children: [
              CustomScrollView(
                slivers: [
                  // 1. FULL SCREEN PHOTO CAROUSEL SLIVER APPBAR
                  SliverAppBar(
                    expandedHeight: 350,
                    pinned: true,
                    backgroundColor: ImperialColors.primary,
                    leading: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: CircleAvatar(
                        backgroundColor: ImperialColors.primary.withValues(alpha: 0.75),
                        child: IconButton(
                          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18, color: Colors.white),
                          onPressed: () => Navigator.of(context).pop(),
                        ),
                      ),
                    ),
                    actions: [
                      // Compare AnimatedContainer button
                      GestureDetector(
                        onTap: () async {
                          final msg = await widget.appState.toggleCompare(lot.id);
                          if (msg != null && context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text(msg)),
                            );
                          }
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 260),
                          margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          decoration: BoxDecoration(
                            color: isComp
                                ? ImperialColors.accent
                                : ImperialColors.primary.withValues(alpha: 0.75),
                            borderRadius: BorderRadius.circular(999),
                            border: Border.all(color: ImperialColors.accent),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                Icons.compare_arrows_rounded,
                                size: 17,
                                color: isComp ? ImperialColors.primary : ImperialColors.accent,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                isComp ? 'Comparé' : 'Comparer',
                                style: ImperialTheme.bodyStyle(
                                  fontSize: 11.5,
                                  fontWeight: FontWeight.w700,
                                  color: isComp ? ImperialColors.primary : Colors.white,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      // Favorite AnimatedContainer button
                      GestureDetector(
                        behavior: HitTestBehavior.opaque,
                        onTap: () {
                          HapticFeedback.lightImpact();
                          final willBeFav = !widget.appState.isFavorite(lot.id);
                          widget.appState.toggleFavorite(lot.id);
                          ScaffoldMessenger.of(context).hideCurrentSnackBar();
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              duration: const Duration(milliseconds: 1800),
                              backgroundColor: ImperialColors.primary,
                              behavior: SnackBarBehavior.floating,
                              margin: const EdgeInsets.fromLTRB(16, 0, 16, 85),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                              content: Row(
                                children: [
                                  Icon(
                                    willBeFav ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                                    color: ImperialColors.accent,
                                    size: 18,
                                  ),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Text(
                                      willBeFav
                                          ? '${lot.title} ajouté à vos favoris'
                                          : '${lot.title} retiré de vos favoris',
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 12.5,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 280),
                          margin: const EdgeInsets.only(right: 12, top: 8, bottom: 8, left: 4),
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: isFav
                                ? Colors.white
                                : ImperialColors.primary.withValues(alpha: 0.75),
                            shape: BoxShape.circle,
                            boxShadow: isFav
                                ? [
                                    BoxShadow(
                                      color: const Color(0xFFC5A059).withValues(alpha: 0.35),
                                      blurRadius: 8,
                                      offset: const Offset(0, 2),
                                    ),
                                  ]
                                : [],
                            border: Border.all(
                              color: isFav
                                  ? Colors.white
                                  : ImperialColors.accent.withValues(alpha: 0.6),
                            ),
                          ),
                          child: Icon(
                            isFav ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                            color: isFav ? const Color(0xFFC5A059) : Colors.white,
                            size: 20,
                          ),
                        ),
                      ),
                    ],
                    flexibleSpace: FlexibleSpaceBar(
                      background: Stack(
                        fit: StackFit.expand,
                        children: [
                          PageView.builder(
                            controller: _pageController,
                            itemCount: gallery.length,
                            onPageChanged: (idx) => setState(() => _currentImageIndex = idx),
                            itemBuilder: (context, idx) {
                              final item = gallery[idx];
                              return SmartAssetImage(
                                localPath: item.localPath,
                                remoteUrl: item.remoteUrl,
                                fit: BoxFit.cover,
                              );
                            },
                          ),
                          // Bottom gradient overlay
                          IgnorePointer(
                            child: Container(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topCenter,
                                  end: Alignment.bottomCenter,
                                  colors: [
                                    ImperialColors.primary.withValues(alpha: 0.4),
                                    Colors.transparent,
                                    ImperialColors.primary.withValues(alpha: 0.85),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          // Pagination Dots using AnimatedContainer
                          Positioned(
                            bottom: 18,
                            left: 20,
                            right: 20,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: List.generate(gallery.length, (i) {
                                    final active = i == _currentImageIndex;
                                    return AnimatedContainer(
                                      duration: const Duration(milliseconds: 250),
                                      margin: const EdgeInsets.only(right: 6),
                                      width: active ? 24 : 7,
                                      height: 7,
                                      decoration: BoxDecoration(
                                        color: active
                                            ? ImperialColors.accent
                                            : Colors.white.withValues(alpha: 0.45),
                                        borderRadius: BorderRadius.circular(999),
                                      ),
                                    );
                                  }),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: ImperialColors.primary.withValues(alpha: 0.75),
                                    borderRadius: BorderRadius.circular(999),
                                    border: Border.all(color: ImperialColors.accent.withValues(alpha: 0.4)),
                                  ),
                                  child: Text(
                                    '${_currentImageIndex + 1} / ${gallery.length} PHOTOS',
                                    style: ImperialTheme.bodyStyle(
                                      fontSize: 10.5,
                                      fontWeight: FontWeight.w700,
                                      color: ImperialColors.accentLight,
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

                  // 2. CONTENT BODY
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(18, 20, 18, 130),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // EN-TÊTE DE PRESTIGE & DEFINITION DU LOT
                          _buildPrestigeHeader(lot)
                              .animate()
                              .fadeIn(duration: 380.ms)
                              .slideY(begin: 0.08, end: 0),

                          const SizedBox(height: 18),

                          // GRILLE DE MÉTRIQUES ARCHITECTURALES CLÉS
                          _buildKeyMetricsGrid(lot)
                              .animate()
                              .fadeIn(delay: 90.ms, duration: 400.ms)
                              .slideY(begin: 0.08, end: 0),

                          const SizedBox(height: 22),

                          // INTERACTIVE TABS (PLAN 2D / VEFA 5 TRANCHES / PRESTATIONS)
                          _buildSectionSelector()
                              .animate()
                              .fadeIn(delay: 150.ms, duration: 380.ms),

                          const SizedBox(height: 16),

                          if (_activeTab == 0)
                            _buildZoomablePlanSection(lot)
                                .animate()
                                .fadeIn(duration: 320.ms)
                                .scale(begin: const Offset(0.98, 0.98))
                          else if (_activeTab == 1)
                            _buildVefaScheduleSection(lot)
                                .animate()
                                .fadeIn(duration: 320.ms)
                                .slideX(begin: 0.04, end: 0)
                          else
                            _buildFeaturesCard(lot)
                                .animate()
                                .fadeIn(duration: 320.ms)
                                .slideX(begin: 0.04, end: 0),
                        ],
                      ),
                    ),
                  ),
                ],
              ),

              // 3. STICKY BOTTOM CTA BAR (WHATSAPP DIRECT EN 1 CLIC)
              Positioned(
                left: 0,
                right: 0,
                bottom: 0,
                child: _buildStickyBottomBar(lot)
                    .animate()
                    .fadeIn(delay: 250.ms, duration: 400.ms)
                    .slideY(begin: 0.3, end: 0),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildPrestigeHeader(ResidenceLot lot) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: ImperialColors.surface,
        borderRadius: BorderRadius.circular(22),
        boxShadow: ImperialTheme.modernCardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              StatusBadge(status: lot.status),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: ImperialColors.primary,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  'Titre Foncier TF 34 603/M',
                  style: ImperialTheme.bodyStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w700,
                    color: ImperialColors.accentLight,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      lot.title,
                      style: ImperialTheme.displayStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${lot.type} • ${lot.floorName} • Cabinet AMA Architecture',
                      style: ImperialTheme.bodyStyle(
                        fontSize: 13,
                        color: ImperialColors.textSecondary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const Divider(height: 24, color: ImperialColors.surfaceVariant),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Conditions & Disponibilités',
                    style: ImperialTheme.bodyStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: ImperialColors.textMuted,
                      letterSpacing: 0.3,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: ImperialColors.accent.withValues(alpha: 0.16),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      'Prix sur demande',
                      style: ImperialTheme.displayStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                        color: ImperialColors.accentDark,
                        letterSpacing: 0.3,
                      ),
                    ),
                  ),
                ],
              ),
              ElevatedButton.icon(
                onPressed: _launchWhatsAppInquiry,
                style: ElevatedButton.styleFrom(
                  backgroundColor: ImperialColors.primary,
                  foregroundColor: ImperialColors.accent,
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
                ),
                icon: const Icon(Icons.send_rounded, size: 14, color: ImperialColors.accent),
                label: Text(
                  'Message Direct',
                  style: ImperialTheme.bodyStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: ImperialColors.accent),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildKeyMetricsGrid(ResidenceLot lot) {
    final metrics = [
      (Icons.square_foot_rounded, 'SURFACE HABITABLE', lot.surfaceFormatted),
      (Icons.layers_rounded, 'NIVEAU', lot.floorName.split(' (').first),
      (Icons.king_bed_rounded, 'PIÈCES', lot.bedrooms == 0 ? 'Studio' : '${lot.bedrooms} Ch. + Séjour'),
      (Icons.bathtub_outlined, 'SALLES DE BAIN', '${lot.bathrooms} SDB Marbre'),
      (Icons.wb_sunny_outlined, 'EXPOSITION', lot.orientation.split(' (').first),
      (Icons.landscape_rounded, 'VUE PRINCIPALE', lot.view.replaceAll('Vue ', '')),
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: metrics.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 10,
        crossAxisSpacing: 10,
        childAspectRatio: 2.35,
      ),
      itemBuilder: (context, index) {
        final m = metrics[index];
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          decoration: BoxDecoration(
            color: ImperialColors.surface,
            borderRadius: BorderRadius.circular(16),
            boxShadow: ImperialTheme.modernCardShadow,
          ),
          child: Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: ImperialColors.primary,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(m.$1, color: ImperialColors.accent, size: 18),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      m.$2,
                      style: ImperialTheme.bodyStyle(
                        fontSize: 9.5,
                        fontWeight: FontWeight.w700,
                        color: ImperialColors.textMuted,
                        letterSpacing: 0.6,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      m.$3,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: ImperialTheme.bodyStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: ImperialColors.textPrimary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSectionSelector() {
    final tabs = [
      (0, Icons.architecture_rounded, 'Plan 2D Zoom'),
      (1, Icons.account_balance_wallet_outlined, 'Loi VEFA (%)'),
      (2, Icons.verified_outlined, 'Prestations & Finitions'),
    ];

    return Container(
      padding: const EdgeInsets.all(5),
      decoration: BoxDecoration(
        color: ImperialColors.surfaceVariant,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: tabs.map((t) {
          final selected = _activeTab == t.$1;
          return Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _activeTab = t.$1),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                curve: Curves.easeOutCubic,
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: selected ? ImperialColors.primary : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: selected
                      ? [
                          BoxShadow(
                            color: ImperialColors.primary.withValues(alpha: 0.2),
                            blurRadius: 8,
                            offset: const Offset(0, 3),
                          )
                        ]
                      : [],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      t.$2,
                      size: 15,
                      color: selected ? ImperialColors.accent : ImperialColors.textSecondary,
                    ),
                    const SizedBox(width: 5),
                    Flexible(
                      child: Text(
                        t.$3,
                        overflow: TextOverflow.ellipsis,
                        style: ImperialTheme.bodyStyle(
                          fontSize: 11.5,
                          fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                          color: selected ? ImperialColors.accent : ImperialColors.textSecondary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildZoomablePlanSection(ResidenceLot lot) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: ImperialColors.surface,
        borderRadius: BorderRadius.circular(22),
        boxShadow: ImperialTheme.modernCardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Plan Architectural Officiel',
                      style: ImperialTheme.displayStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    Text(
                      'Pincez pour zoomer (Pinch-to-Zoom) • ${lot.floorName}',
                      style: ImperialTheme.bodyStyle(
                        fontSize: 11.5,
                        color: ImperialColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              TextButton.icon(
                onPressed: _openFullScreenPlan,
                style: TextButton.styleFrom(
                  backgroundColor: ImperialColors.primary,
                  foregroundColor: ImperialColors.accent,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                ),
                icon: const Icon(Icons.fullscreen_rounded, size: 17),
                label: Text(
                  'Plein Écran',
                  style: ImperialTheme.bodyStyle(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w700,
                    color: ImperialColors.accent,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            height: 280,
            width: double.infinity,
            decoration: BoxDecoration(
              color: ImperialColors.surfaceVariant,
              borderRadius: BorderRadius.circular(16),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: InteractiveViewer(
                transformationController: _planZoomController,
                minScale: 1.0,
                maxScale: 4.5,
                child: SmartAssetImage(
                  localPath: lot.assets.planLocalPath,
                  remoteUrl: lot.assets.planRemoteUrl,
                  fit: BoxFit.contain,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVefaScheduleSection(ResidenceLot lot) {
    final steps = [
      ('1. Contrat de Réservation', '10%', 'Signature du contrat préliminaire & réservation officielle du lot'),
      ('2. Achèvement des Fondations', '20%', 'Achèvement des travaux de terrassement, sous-sols et fondations'),
      ('3. Achèvement du Gros Œuvre', '30%', 'Élévation de la structure porteuse en béton armé jusqu\'au R+5'),
      ('4. Achèvement des Finitions', '30%', 'Pose du marbre, boiseries, cuisine, sanitaires et climatisation VRV'),
      ('5. Remise des Clés & Notaire', '10%', 'Délivrance du permis d\'habiter, remise des clés et acte notarié définitif'),
    ];

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: ImperialColors.surface,
        borderRadius: BorderRadius.circular(22),
        boxShadow: ImperialTheme.modernCardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.verified_user_rounded, color: ImperialColors.accentDark, size: 20),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Échéancier Légal VEFA (Loi 107-12)',
                  style: ImperialTheme.displayStyle(fontSize: 15),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            'Garantie Financière d\'Achèvement Bancaire (GFA) • 5 tranches réglementaires.',
            style: ImperialTheme.bodyStyle(fontSize: 12, color: ImperialColors.textSecondary),
          ),
          const SizedBox(height: 16),
          ...List.generate(steps.length, (idx) {
            final s = steps[idx];
            final isSelected = _selectedVefaStep == idx;
            return GestureDetector(
              onTap: () => setState(() => _selectedVefaStep = idx),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 260),
                margin: const EdgeInsets.only(bottom: 10),
                padding: EdgeInsets.all(isSelected ? 14 : 11),
                decoration: BoxDecoration(
                  color: isSelected ? ImperialColors.primary : ImperialColors.surfaceVariant,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3.5),
                          decoration: BoxDecoration(
                            color: ImperialColors.accent,
                            borderRadius: BorderRadius.circular(999),
                          ),
                          child: Text(
                            s.$2,
                            style: ImperialTheme.bodyStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: ImperialColors.primary,
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            s.$1,
                            style: ImperialTheme.bodyStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: isSelected ? Colors.white : ImperialColors.textPrimary,
                            ),
                          ),
                        ),
                        Icon(
                          isSelected ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded,
                          size: 18,
                          color: isSelected ? ImperialColors.accent : ImperialColors.textMuted,
                        ),
                      ],
                    ),
                    if (isSelected) ...[
                      const SizedBox(height: 8),
                      Text(
                        s.$3,
                        style: ImperialTheme.bodyStyle(
                          fontSize: 12,
                          color: Colors.white70,
                          height: 1.4,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildFeaturesCard(ResidenceLot lot) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: ImperialColors.surface,
        borderRadius: BorderRadius.circular(22),
        boxShadow: ImperialTheme.modernCardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Prestations & Finitions du Lot',
            style: ImperialTheme.displayStyle(fontSize: 16),
          ),
          const SizedBox(height: 12),
          ...lot.features.map(
            (f) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.check_circle_rounded, color: ImperialColors.accentDark, size: 18),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      f,
                      style: ImperialTheme.bodyStyle(
                        fontSize: 13.5,
                        color: ImperialColors.textSecondary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const Divider(height: 24),
          Text(
            'Engagements du Promoteur',
            style: ImperialTheme.displayStyle(fontSize: 15),
          ),
          const SizedBox(height: 8),
          _specRow('Titre Foncier', 'TF 34 603/M individuel définitif'),
          _specRow('Statut VNA', 'Non requise (Acquisition ouverte 100% aux étrangers)'),
          _specRow('Stationnement', 'Place privative sous-sol sécurisée numérotée'),
          _specRow('Accès Rooftop', 'Double piscine panoramique de 78 mètres incluse'),
        ],
      ),
    );
  }

  Widget _specRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: ImperialTheme.bodyStyle(fontSize: 12, color: ImperialColors.textSecondary)),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.end,
              style: ImperialTheme.bodyStyle(fontSize: 12, fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStickyBottomBar(ResidenceLot lot) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      decoration: BoxDecoration(
        color: ImperialColors.primary,
        border: const Border(
          top: BorderSide(color: ImperialColors.borderGold, width: 1),
        ),
        boxShadow: [
          BoxShadow(
            color: ImperialColors.primary.withValues(alpha: 0.35),
            blurRadius: 24,
            offset: const Offset(0, -6),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            // Direct phone call button
            InkWell(
              onTap: _launchPhoneCall,
              borderRadius: BorderRadius.circular(14),
              child: Container(
                width: 48,
                height: 50,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: ImperialColors.accent.withValues(alpha: 0.5)),
                ),
                child: const Icon(Icons.phone_in_talk_rounded, color: ImperialColors.accent, size: 20),
              ),
            ),
            const SizedBox(width: 8),
            // Official Fiche PDF Download Button
            InkWell(
              onTap: () => PdfDocumentService.openLotBrochurePdf(lot: lot),
              borderRadius: BorderRadius.circular(14),
              child: Container(
                width: 52,
                height: 50,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: ImperialColors.accent.withValues(alpha: 0.5)),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.picture_as_pdf_rounded,
                        color: ImperialColors.accent, size: 18),
                    Text(
                      'PDF',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 8.5,
                        fontWeight: FontWeight.w800,
                        color: ImperialColors.accent,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 10),
            // Primary WhatsApp Inquiry Button (Luminous Royal Champagne Gold)
            Expanded(
              child: Container(
                height: 50,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [
                      Color(0xFFDFBA73), // Warm Champagne Gold
                      Color(0xFFC5A880), // Jardins de Bali Gold
                      Color(0xFFA8895E), // Rich Deep Gold
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFC5A880).withValues(alpha: 0.45),
                      blurRadius: 18,
                      offset: const Offset(0, 4),
                    ),
                  ],
                  border: Border.all(
                    color: const Color(0xFFFFE8B8).withValues(alpha: 0.65),
                    width: 1,
                  ),
                ),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    borderRadius: BorderRadius.circular(16),
                    onTap: _launchWhatsAppInquiry,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.send_rounded, size: 18, color: Color(0xFF0E130D)),
                        const SizedBox(width: 8),
                        Text(
                          'Demander Dossier & Disponibilités',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 12.5,
                            fontWeight: FontWeight.w800,
                            color: const Color(0xFF0E130D),
                            letterSpacing: 0.3,
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
    );
  }
}
