// =========================================================================
// JARDINS DE BALI — LOT COMPARATOR & FAVORITES MODAL SHEET (APP STORE VIP)
// =========================================================================

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/app_models.dart';
import '../state/app_state.dart';
import '../theme/imperial_theme.dart';
import '../screens/lot_detail_screen.dart';

class ComparatorAndFavoritesSheet extends StatefulWidget {
  final AppState appState;
  final int initialTab; // 0 = Favoris, 1 = Comparateur

  const ComparatorAndFavoritesSheet({
    super.key,
    required this.appState,
    this.initialTab = 0,
  });

  @override
  State<ComparatorAndFavoritesSheet> createState() =>
      _ComparatorAndFavoritesSheetState();
}

class _ComparatorAndFavoritesSheetState
    extends State<ComparatorAndFavoritesSheet> {
  late int _tab;

  @override
  void initState() {
    super.initState();
    _tab = widget.initialTab;
  }

  Future<void> _inquireLotWhatsApp(ResidenceLot lot) async {
    final msg = Uri.encodeComponent(
      'Bonjour BaytImmo, je souhaite connaître les disponibilités et conditions pour le lot ${lot.title} (${lot.surfaceFormatted} au ${lot.floorName}).',
    );
    final uri = Uri.parse('https://wa.me/212665644391?text=$msg');
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: widget.appState,
      builder: (context, _) {
        final favs = widget.appState.favoriteLots;
        final comps = widget.appState.comparedLots;

        return DraggableScrollableSheet(
          initialChildSize: 0.82,
          minChildSize: 0.5,
          maxChildSize: 0.95,
          expand: false,
          builder: (context, scrollController) {
            return Container(
              decoration: const BoxDecoration(
                color: ImperialColors.background,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              child: Column(
                children: [
                  const SizedBox(height: 10),
                  Container(
                    width: 42,
                    height: 4,
                    decoration: BoxDecoration(
                      color: ImperialColors.border,
                      borderRadius: BorderRadius.circular(999),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
                    child: Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _tab = 0),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 240),
                              padding: const EdgeInsets.symmetric(vertical: 11),
                              decoration: BoxDecoration(
                                color: _tab == 0
                                    ? ImperialColors.primary
                                    : ImperialColors.surface,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: _tab == 0
                                      ? ImperialColors.accent
                                      : ImperialColors.border,
                                ),
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                'MES FAVORIS (${favs.length})',
                                style: ImperialTheme.bodyStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: _tab == 0
                                      ? ImperialColors.accent
                                      : ImperialColors.textSecondary,
                                ),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _tab = 1),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 240),
                              padding: const EdgeInsets.symmetric(vertical: 11),
                              decoration: BoxDecoration(
                                color: _tab == 1
                                    ? ImperialColors.primary
                                    : ImperialColors.surface,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: _tab == 1
                                      ? ImperialColors.accent
                                      : ImperialColors.border,
                                ),
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                'COMPARATEUR (${comps.length}/3)',
                                style: ImperialTheme.bodyStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: _tab == 1
                                      ? ImperialColors.accent
                                      : ImperialColors.textSecondary,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Expanded(
                    child: _tab == 0
                        ? _buildFavoritesList(favs, scrollController)
                        : _buildComparatorTable(comps, scrollController),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildFavoritesList(
      List<ResidenceLot> favs, ScrollController controller) {
    if (favs.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.favorite_border_rounded,
                  size: 48, color: ImperialColors.accent),
              const SizedBox(height: 12),
              Text(
                'Aucun lot en favoris',
                style: ImperialTheme.displayStyle(fontSize: 18),
              ),
              const SizedBox(height: 6),
              Text(
                'Touchez le cœur sur n\'importe quel appartement pour sauvegarder votre sélection personnelle.',
                textAlign: TextAlign.center,
                style: ImperialTheme.bodyStyle(
                    color: ImperialColors.textSecondary),
              ),
            ],
          ),
        ),
      );
    }

    return ListView.builder(
      controller: controller,
      padding: const EdgeInsets.all(18),
      itemCount: favs.length,
      itemBuilder: (context, index) {
        final lot = favs[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            contentPadding: const EdgeInsets.all(12),
            leading: SmartAssetImage(
              localPath: lot.assets.thumbLocalPath,
              remoteUrl: lot.assets.thumbRemoteUrl,
              width: 72,
              height: 72,
              borderRadius: BorderRadius.circular(12),
            ),
            title: Text(
              lot.title,
              style: ImperialTheme.displayStyle(fontSize: 15),
            ),
            subtitle: Text(
              '${lot.surfaceFormatted} • ${lot.floorName}\n${lot.view}',
              style: ImperialTheme.bodyStyle(
                fontSize: 12,
                color: ImperialColors.textSecondary,
              ),
            ),
            trailing: IconButton(
              icon: const Icon(Icons.delete_outline_rounded,
                  color: ImperialColors.reserved),
              onPressed: () => widget.appState.toggleFavorite(lot.id),
            ),
            onTap: () {
              Navigator.of(context).pop();
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) =>
                      LotDetailScreen(lot: lot, appState: widget.appState),
                ),
              );
            },
          ),
        ).animate().fadeIn(delay: (index * 60).ms).slideX(begin: 0.05, end: 0);
      },
    );
  }

  Widget _buildComparatorTable(
      List<ResidenceLot> comps, ScrollController controller) {
    if (comps.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.compare_arrows_rounded,
                  size: 48, color: ImperialColors.accent),
              const SizedBox(height: 12),
              Text(
                'Comparateur de Lots Vide',
                style: ImperialTheme.displayStyle(fontSize: 18),
              ),
              const SizedBox(height: 6),
              Text(
                'Sélectionnez jusqu\'à 3 appartements pour comparer leurs surfaces, étages, vues et prestations côte à côte.',
                textAlign: TextAlign.center,
                style: ImperialTheme.bodyStyle(
                    color: ImperialColors.textSecondary),
              ),
            ],
          ),
        ),
      );
    }

    return ListView(
      controller: controller,
      padding: const EdgeInsets.all(18),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'COMPARAISON CÔTE À CÔTE',
              style: ImperialTheme.displayStyle(fontSize: 15),
            ),
            TextButton(
              onPressed: widget.appState.clearCompare,
              child: const Text('Vider tout'),
            ),
          ],
        ),
        const SizedBox(height: 12),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: comps.map((lot) {
              return Container(
                width: 220,
                margin: const EdgeInsets.only(right: 12),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: ImperialColors.surface,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: ImperialTheme.modernCardShadow,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SmartAssetImage(
                      localPath: lot.assets.thumbLocalPath,
                      remoteUrl: lot.assets.thumbRemoteUrl,
                      height: 110,
                      width: double.infinity,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    const SizedBox(height: 10),
                    StatusBadge(status: lot.status, compact: true),
                    const SizedBox(height: 8),
                    Text(
                      lot.id,
                      style: ImperialTheme.displayStyle(fontSize: 17),
                    ),
                    Text(
                      lot.category,
                      style: ImperialTheme.bodyStyle(
                          fontSize: 12, color: ImperialColors.textSecondary),
                    ),
                    const Divider(height: 20),
                    _compRow('Disponibilité', 'Prix sur demande', highlight: true),
                    _compRow('Surface', lot.surfaceFormatted),
                    _compRow('Étage', lot.floorName),
                    _compRow('Chambres',
                        lot.bedrooms == 0 ? 'Studio' : '${lot.bedrooms} Ch.'),
                    _compRow('Exposition', lot.orientation.split(' (').first),
                    _compRow('Vue', lot.view.replaceAll('Vue ', '')),
                    const SizedBox(height: 10),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: ImperialColors.primary,
                          foregroundColor: ImperialColors.accent,
                          elevation: 0,
                        ),
                        icon: const Icon(Icons.send_rounded, size: 14),
                        onPressed: () => _inquireLotWhatsApp(lot),
                        label: const Text('Contacter', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                      ),
                    ),
                    const SizedBox(height: 6),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          foregroundColor: ImperialColors.textPrimary,
                        ),
                        onPressed: () {
                          Navigator.of(context).pop();
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => LotDetailScreen(
                                  lot: lot, appState: widget.appState),
                            ),
                          );
                        },
                        child: const Text('Voir la fiche', style: TextStyle(fontSize: 11.5)),
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn().scale(begin: const Offset(0.95, 0.95));
            }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _compRow(String label, String val, {bool highlight = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: ImperialTheme.bodyStyle(
                fontSize: 10.5, color: ImperialColors.textMuted),
          ),
          Text(
            val,
            style: ImperialTheme.bodyStyle(
              fontSize: 12.5,
              fontWeight: FontWeight.w700,
              color: highlight
                  ? ImperialColors.accentDark
                  : ImperialColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
