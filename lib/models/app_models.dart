// =========================================================================
// JARDINS DE BALI MARRAKECH — COMPLETE FLUTTER DATA MODELS (DART 3)
// Compatible with 01_DATA_JSON_ET_API/full_app_bundle.json
// =========================================================================

import 'dart:convert';

class FullAppBundle {
  final ProjectInfo project;
  final ContactLeads contact;
  final List<Amenity> amenities;
  final List<FaqItem> faq;
  final List<ResidenceLot> residences;
  final List<RetailSpace> retailSpaces;
  final List<RetailSpace> offices;

  FullAppBundle({
    required this.project,
    required this.contact,
    required this.amenities,
    required this.faq,
    required this.residences,
    required this.retailSpaces,
    required this.offices,
  });

  factory FullAppBundle.fromJson(Map<String, dynamic> json) {
    return FullAppBundle(
      project: ProjectInfo.fromJson(json['project'] ?? {}),
      contact: ContactLeads.fromJson(json['contact'] ?? {}),
      amenities: (json['amenities'] as List<dynamic>? ?? [])
          .map((e) => Amenity.fromJson(e as Map<String, dynamic>))
          .toList(),
      faq: (json['faq'] as List<dynamic>? ?? [])
          .map((e) => FaqItem.fromJson(e as Map<String, dynamic>))
          .toList(),
      residences: (json['residences'] as List<dynamic>? ?? [])
          .map((e) => ResidenceLot.fromJson(e as Map<String, dynamic>))
          .toList(),
      retailSpaces: (json['retailSpaces'] as List<dynamic>? ?? [])
          .map((e) => RetailSpace.fromJson(e as Map<String, dynamic>))
          .toList(),
      offices: (json['offices'] as List<dynamic>? ?? [])
          .map((e) => RetailSpace.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  static FullAppBundle fromRawJson(String str) =>
      FullAppBundle.fromJson(json.decode(str) as Map<String, dynamic>);
}

class ProjectInfo {
  final String projectName;
  final String tagline;
  final String titreFoncier;
  final DeveloperInfo developer;
  final ArchitectInfo architect;
  final LocationInfo location;
  final KeyMetrics keyMetrics;

  ProjectInfo({
    required this.projectName,
    required this.tagline,
    required this.titreFoncier,
    required this.developer,
    required this.architect,
    required this.location,
    required this.keyMetrics,
  });

  factory ProjectInfo.fromJson(Map<String, dynamic> json) {
    return ProjectInfo(
      projectName: json['projectName'] ?? 'Jardins de Bali Marrakech Menara',
      tagline: json['tagline'] ?? '',
      titreFoncier: json['titreFoncier'] ?? 'TF 34 603/M',
      developer: DeveloperInfo.fromJson(json['developer'] ?? {}),
      architect: ArchitectInfo.fromJson(json['architect'] ?? {}),
      location: LocationInfo.fromJson(json['location'] ?? {}),
      keyMetrics: KeyMetrics.fromJson(json['keyMetrics'] ?? {}),
    );
  }
}

class DeveloperInfo {
  final String name;
  final String brand;
  final String website;
  final String liveDemo;
  final String author;
  final String phone;
  final String phoneFixe;
  final String email;
  final String headquarters;

  DeveloperInfo({
    required this.name,
    required this.brand,
    required this.website,
    required this.liveDemo,
    required this.author,
    required this.phone,
    required this.phoneFixe,
    required this.email,
    required this.headquarters,
  });

  factory DeveloperInfo.fromJson(Map<String, dynamic> json) {
    return DeveloperInfo(
      name: json['name'] ?? 'BaytImmo Groupe Immobilier',
      brand: json['brand'] ?? 'BaytImmo Prestige',
      website: json['website'] ?? 'https://bayt-immo.com',
      liveDemo: json['liveDemo'] ?? '',
      author: json['author'] ?? 'Sohaib Ghaberi',
      phone: json['phone'] ?? '+212 665-644391',
      phoneFixe: json['phoneFixe'] ?? '+212 524-420000',
      email: json['email'] ?? 'contact@bayt-immo.com',
      headquarters: json['headquarters'] ?? 'Quartier Rahham, Lot B5 (Rue Ibn Batouta), Menara, Marrakech',
    );
  }
}

class ArchitectInfo {
  final String name;
  final String principalArchitect;
  final String location;
  final String designVision;

  ArchitectInfo({
    required this.name,
    required this.principalArchitect,
    required this.location,
    required this.designVision,
  });

  factory ArchitectInfo.fromJson(Map<String, dynamic> json) {
    return ArchitectInfo(
      name: json['name'] ?? 'Cabinet AMA Architecture',
      principalArchitect: json['principalArchitect'] ?? 'M. Amar Menara',
      location: json['location'] ?? 'Guéliz, Marrakech',
      designVision: json['designVision'] ?? '',
    );
  }
}

class LocationInfo {
  final String city;
  final String district;
  final String address;
  final double latitude;
  final double longitude;
  final String googleMapsUrl;
  final List<AccessibilityPoint> accessibility;

  LocationInfo({
    required this.city,
    required this.district,
    required this.address,
    required this.latitude,
    required this.longitude,
    required this.googleMapsUrl,
    required this.accessibility,
  });

  factory LocationInfo.fromJson(Map<String, dynamic> json) {
    final coords = json['coordinates'] as Map<String, dynamic>? ?? {};
    return LocationInfo(
      city: json['city'] ?? 'Marrakech',
      district: json['district'] ?? 'Quartier Rahham, Zone B5 • Arrondissement Menara',
      address: json['address'] ?? 'Quartier Rahham, Lot B5 (Rue Ibn Batouta), Menara, Marrakech',
      latitude: (coords['latitude'] as num?)?.toDouble() ?? 31.628587,
      longitude: (coords['longitude'] as num?)?.toDouble() ?? -8.036180,
      googleMapsUrl: json['googleMapsUrl'] ??
          'https://www.google.com/maps/place/31.628587,-8.036180/@31.628587,-8.036180,18z',
      accessibility: (json['accessibility'] as List<dynamic>? ?? [])
          .map((e) => AccessibilityPoint.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class AccessibilityPoint {
  final String name;
  final String distance;
  final String time;

  AccessibilityPoint({
    required this.name,
    required this.distance,
    required this.time,
  });

  factory AccessibilityPoint.fromJson(Map<String, dynamic> json) {
    return AccessibilityPoint(
      name: json['name'] ?? '',
      distance: json['distance'] ?? '',
      time: json['time'] ?? '',
    );
  }
}

class KeyMetrics {
  final String surfacePlancherCouverte;
  final String empriseAuSol;
  final String niveaux;
  final int totalLots;
  final int totalAppartements;
  final int totalCommercesFlagship;
  final int totalBureauxEtSuitesCorporate;
  final int capaciteParkingSousSol;
  final String longueurPiscineRooftop;
  final int nombrePalmiersPhoenix;
  final String dateLivraisonPrevisionnelle;
  final String garantieDecennale;

  KeyMetrics({
    required this.surfacePlancherCouverte,
    required this.empriseAuSol,
    required this.niveaux,
    required this.totalLots,
    required this.totalAppartements,
    required this.totalCommercesFlagship,
    required this.totalBureauxEtSuitesCorporate,
    required this.capaciteParkingSousSol,
    required this.longueurPiscineRooftop,
    required this.nombrePalmiersPhoenix,
    required this.dateLivraisonPrevisionnelle,
    required this.garantieDecennale,
  });

  factory KeyMetrics.fromJson(Map<String, dynamic> json) {
    return KeyMetrics(
      surfacePlancherCouverte: json['surfacePlancherCouverte'] ?? '15 746 m²',
      empriseAuSol: json['empriseAuSol'] ?? '2 624 m²',
      niveaux: json['niveaux'] ?? 'R+5 avec Mezzanine et 2 Sous-Sols',
      totalLots: json['totalLots'] ?? 234,
      totalAppartements: json['totalAppartements'] ?? 230,
      totalCommercesFlagship: json['totalCommercesFlagship'] ?? 4,
      totalBureauxEtSuitesCorporate: json['totalBureauxEtSuitesCorporate'] ?? 0,
      capaciteParkingSousSol: json['capaciteParkingSousSol'] ?? 234,
      longueurPiscineRooftop: json['longueurPiscineRooftop'] ?? '78 mètres',
      nombrePalmiersPhoenix: json['nombrePalmiersPhoenix'] ?? 38,
      dateLivraisonPrevisionnelle: json['dateLivraisonPrevisionnelle'] ?? '4ème Trimestre 2026',
      garantieDecennale: json['garantieDecennale'] ?? '',
    );
  }
}

class Amenity {
  final String id;
  final String title;
  final String subtitle;
  final String description;
  final String icon;
  final String badge;
  final String image;

  Amenity({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.description,
    required this.icon,
    required this.badge,
    required this.image,
  });

  String get assetPath => 'assets/$image';

  factory Amenity.fromJson(Map<String, dynamic> json) {
    return Amenity(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      subtitle: json['subtitle'] ?? '',
      description: json['description'] ?? '',
      icon: json['icon'] ?? 'pool',
      badge: json['badge'] ?? '',
      image: json['image'] ?? '',
    );
  }
}

class FaqItem {
  final String question;
  final String answer;

  FaqItem({required this.question, required this.answer});

  factory FaqItem.fromJson(Map<String, dynamic> json) {
    return FaqItem(
      question: json['question'] ?? '',
      answer: json['answer'] ?? '',
    );
  }
}

class ContactLeads {
  final String companyName;
  final String commercialEntity;
  final String telephoneDirect;
  final String telephoneCommercial;
  final String whatsappNumber;
  final String whatsappDeepLink;
  final String email;
  final String address;
  final String openingHours;
  final List<LeadFormField> formFields;

  ContactLeads({
    required this.companyName,
    required this.commercialEntity,
    required this.telephoneDirect,
    required this.telephoneCommercial,
    required this.whatsappNumber,
    required this.whatsappDeepLink,
    required this.email,
    required this.address,
    required this.openingHours,
    required this.formFields,
  });

  factory ContactLeads.fromJson(Map<String, dynamic> json) {
    final agency = json['agencyInfo'] as Map<String, dynamic>? ?? {};
    final schema = json['leadFormSchema'] as Map<String, dynamic>? ?? {};
    final fields = (schema['fields'] as List<dynamic>? ?? [])
        .map((f) => LeadFormField.fromJson(f as Map<String, dynamic>))
        .toList();
    return ContactLeads(
      companyName: agency['companyName'] ?? 'BaytImmo Groupe Immobilier',
      commercialEntity: agency['commercialEntity'] ?? 'Jardins de Bali Marrakech Menara',
      telephoneDirect: agency['telephoneDirect'] ?? '+212 665-644391',
      telephoneCommercial: agency['telephoneCommercial'] ?? '+212 524-420000',
      whatsappNumber: agency['whatsappNumber'] ?? '+212665644391',
      whatsappDeepLink: agency['whatsappDeepLink'] ?? 'https://wa.me/212665644391',
      email: agency['email'] ?? 'contact@bayt-immo.com',
      address: agency['address'] ?? 'Quartier Rahham, Lot B5 (Rue Ibn Batouta), Menara, 40000 Marrakech',
      openingHours: agency['openingHours'] ?? 'Du Lundi au Samedi : 09h00 - 19h30',
      formFields: fields,
    );
  }
}

class LeadFormField {
  final String name;
  final String label;
  final String type;
  final bool requiredField;
  final List<String> options;

  LeadFormField({
    required this.name,
    required this.label,
    required this.type,
    required this.requiredField,
    required this.options,
  });

  factory LeadFormField.fromJson(Map<String, dynamic> json) {
    return LeadFormField(
      name: json['name'] ?? '',
      label: json['label'] ?? '',
      type: json['type'] ?? 'text',
      requiredField: json['required'] ?? false,
      options: List<String>.from(json['options'] ?? []),
    );
  }
}

class ResidenceLot {
  final String id;
  final String slug;
  final String title;
  final String category;
  final String type;
  final num floor;
  final String floorName;
  final double surface;
  final String surfaceFormatted;
  final int rooms;
  final String roomsText;
  final int bedrooms;
  final int bathrooms;
  final String status;
  final int priceMAD;
  final int priceEUR;
  final String priceFormattedMAD;
  final String priceFormattedEUR;
  final int ratePerSqm;
  final String ratePerSqmFormatted;
  final String view;
  final String orientation;
  final List<String> features;
  final LotAssets assets;
  final PaymentSchedule paymentSchedule;

  ResidenceLot({
    required this.id,
    required this.slug,
    required this.title,
    required this.category,
    required this.type,
    required this.floor,
    required this.floorName,
    required this.surface,
    required this.surfaceFormatted,
    required this.rooms,
    required this.roomsText,
    required this.bedrooms,
    required this.bathrooms,
    required this.status,
    required this.priceMAD,
    required this.priceEUR,
    required this.priceFormattedMAD,
    required this.priceFormattedEUR,
    required this.ratePerSqm,
    required this.ratePerSqmFormatted,
    required this.view,
    required this.orientation,
    required this.features,
    required this.assets,
    required this.paymentSchedule,
  });

  bool get isAvailable => status == 'Disponible';
  bool get isReserved => status == 'Réservé';
  bool get isSold => status == 'Vendu';
  bool get isPenthouse => category == '3+ BR';

  String get displayCategory => isPenthouse ? 'Penthouse' : category;

  factory ResidenceLot.fromJson(Map<String, dynamic> json) {
    return ResidenceLot(
      id: json['id'] ?? '',
      slug: json['slug'] ?? '',
      title: json['title'] ?? '',
      category: json['category'] ?? '',
      type: json['type'] ?? '',
      floor: json['floor'] ?? 0,
      floorName: json['floorName'] ?? '',
      surface: (json['surface'] as num?)?.toDouble() ?? 0.0,
      surfaceFormatted: json['surfaceFormatted'] ?? '',
      rooms: (json['rooms'] as num?)?.toInt() ?? 1,
      roomsText: json['roomsText'] ?? '',
      bedrooms: (json['bedrooms'] as num?)?.toInt() ?? 0,
      bathrooms: (json['bathrooms'] as num?)?.toInt() ?? 1,
      status: json['status'] ?? 'Disponible',
      priceMAD: (json['priceMAD'] as num?)?.toInt() ?? 0,
      priceEUR: (json['priceEUR'] as num?)?.toInt() ?? 0,
      priceFormattedMAD: json['priceFormattedMAD'] ?? '',
      priceFormattedEUR: json['priceFormattedEUR'] ?? '',
      ratePerSqm: (json['ratePerSqm'] as num?)?.toInt() ?? 19000,
      ratePerSqmFormatted: json['ratePerSqmFormatted'] ?? '',
      view: json['view'] ?? '',
      orientation: json['orientation'] ?? '',
      features: List<String>.from(json['features'] ?? []),
      assets: LotAssets.fromJson(json['assets'] ?? {}),
      paymentSchedule: PaymentSchedule.fromJson(json['paymentSchedule'] ?? {}),
    );
  }
}

class LotAssets {
  final String planLocalPath;
  final String planRemoteUrl;
  final String thumbLocalPath;
  final String thumbRemoteUrl;
  final List<GalleryItem> gallery;

  LotAssets({
    required this.planLocalPath,
    required this.planRemoteUrl,
    required this.thumbLocalPath,
    required this.thumbRemoteUrl,
    required this.gallery,
  });

  String get planAssetPath => 'assets/$planLocalPath';
  String get thumbAssetPath => 'assets/$thumbLocalPath';

  factory LotAssets.fromJson(Map<String, dynamic> json) {
    return LotAssets(
      planLocalPath: json['planLocalPath'] ?? '',
      planRemoteUrl: json['planRemoteUrl'] ?? '',
      thumbLocalPath: json['thumbLocalPath'] ?? '',
      thumbRemoteUrl: json['thumbRemoteUrl'] ?? '',
      gallery: (json['gallery'] as List<dynamic>? ?? [])
          .map((g) => GalleryItem.fromJson(g as Map<String, dynamic>))
          .toList(),
    );
  }
}

class GalleryItem {
  final String localPath;
  final String remoteUrl;

  GalleryItem({required this.localPath, required this.remoteUrl});

  String get assetPath => 'assets/$localPath';

  factory GalleryItem.fromJson(Map<String, dynamic> json) {
    return GalleryItem(
      localPath: json['localPath'] ?? '',
      remoteUrl: json['remoteUrl'] ?? '',
    );
  }
}

class PaymentSchedule {
  final PaymentStep step1Reservation;
  final PaymentStep step2Fondations;
  final PaymentStep step3GrosOeuvre;
  final PaymentStep step4Finitions;
  final PaymentStep step5RemiseCles;

  PaymentSchedule({
    required this.step1Reservation,
    required this.step2Fondations,
    required this.step3GrosOeuvre,
    required this.step4Finitions,
    required this.step5RemiseCles,
  });

  factory PaymentSchedule.fromJson(Map<String, dynamic> json) {
    return PaymentSchedule(
      step1Reservation: PaymentStep.fromJson(json['step1_reservation'] ?? {}),
      step2Fondations: PaymentStep.fromJson(json['step2_fondations'] ?? {}),
      step3GrosOeuvre: PaymentStep.fromJson(json['step3_gros_oeuvre'] ?? {}),
      step4Finitions: PaymentStep.fromJson(json['step4_finitions'] ?? {}),
      step5RemiseCles: PaymentStep.fromJson(json['step5_remise_cles'] ?? {}),
    );
  }
}

class PaymentStep {
  final String percentage;
  final int amountMAD;

  PaymentStep({required this.percentage, required this.amountMAD});

  int get amountEUR => (amountMAD / 10.8).round();

  factory PaymentStep.fromJson(Map<String, dynamic> json) {
    return PaymentStep(
      percentage: json['percentage'] ?? '',
      amountMAD: (json['amountMAD'] as num?)?.toInt() ?? 0,
    );
  }
}

class RetailSpace {
  final String id;
  final String slug;
  final String name;
  final String title;
  final String type;
  final String typeLabel;
  final String category;
  final double surface;
  final String surfaceFormatted;
  final num floor;
  final String floorName;
  final String floorLabel;
  final String wing;
  final String wingLabel;
  final String ceilingHeight;
  final String linearFacade;
  final String parkingSpots;
  final String extractionDuct;
  final String deliveryAccess;
  final String status;
  final int priceMAD;
  final int priceEUR;
  final String priceFormattedMAD;
  final String priceFormattedEUR;
  final int ratePerSqm;
  final int monthlyRentalEstimateMAD;
  final String monthlyRentalEstimateFormatted;
  final List<String> features;
  final String description;
  final String idealFor;
  final RetailAssets assets;

  RetailSpace({
    required this.id,
    required this.slug,
    required this.name,
    required this.title,
    required this.type,
    required this.typeLabel,
    required this.category,
    required this.surface,
    required this.surfaceFormatted,
    required this.floor,
    required this.floorName,
    required this.floorLabel,
    required this.wing,
    required this.wingLabel,
    required this.ceilingHeight,
    required this.linearFacade,
    required this.parkingSpots,
    required this.extractionDuct,
    required this.deliveryAccess,
    required this.status,
    required this.priceMAD,
    required this.priceEUR,
    required this.priceFormattedMAD,
    required this.priceFormattedEUR,
    required this.ratePerSqm,
    required this.monthlyRentalEstimateMAD,
    required this.monthlyRentalEstimateFormatted,
    required this.features,
    required this.description,
    required this.idealFor,
    required this.assets,
  });

  bool get isAvailable => status == 'Disponible';

  factory RetailSpace.fromJson(Map<String, dynamic> json) {
    return RetailSpace(
      id: json['id'] ?? '',
      slug: json['slug'] ?? '',
      name: json['name'] ?? '',
      title: json['title'] ?? '',
      type: json['type'] ?? 'Retail',
      typeLabel: json['typeLabel'] ?? '',
      category: json['category'] ?? 'Retail',
      surface: (json['surface'] as num?)?.toDouble() ?? 0.0,
      surfaceFormatted: json['surfaceFormatted'] ?? '',
      floor: json['floor'] ?? 0,
      floorName: json['floorName'] ?? '',
      floorLabel: json['floorLabel'] ?? '',
      wing: json['wing'] ?? '',
      wingLabel: json['wingLabel'] ?? '',
      ceilingHeight: json['ceilingHeight'] ?? '',
      linearFacade: json['linearFacade'] ?? '',
      parkingSpots: json['parkingSpots'] ?? '',
      extractionDuct: json['extractionDuct'] ?? '',
      deliveryAccess: json['deliveryAccess'] ?? '',
      status: json['status'] ?? 'Disponible',
      priceMAD: (json['priceMAD'] as num?)?.toInt() ?? 0,
      priceEUR: (json['priceEUR'] as num?)?.toInt() ?? 0,
      priceFormattedMAD: json['priceFormattedMAD'] ?? '',
      priceFormattedEUR: json['priceFormattedEUR'] ?? '',
      ratePerSqm: (json['ratePerSqm'] as num?)?.toInt() ?? 28000,
      monthlyRentalEstimateMAD: (json['monthlyRentalEstimateMAD'] as num?)?.toInt() ?? 0,
      monthlyRentalEstimateFormatted: json['monthlyRentalEstimateFormatted'] ?? '',
      features: List<String>.from(json['features'] ?? []),
      description: json['description'] ?? '',
      idealFor: json['idealFor'] ?? '',
      assets: RetailAssets.fromJson(json['assets'] ?? {}),
    );
  }
}

class RetailAssets {
  final String layoutLocalPath;
  final String layoutRemoteUrl;
  final String thumbLocalPath;
  final String thumbRemoteUrl;
  final String planPdfLocalPath;
  final String planPdfRemoteUrl;

  RetailAssets({
    required this.layoutLocalPath,
    required this.layoutRemoteUrl,
    required this.thumbLocalPath,
    required this.thumbRemoteUrl,
    required this.planPdfLocalPath,
    required this.planPdfRemoteUrl,
  });

  String get layoutAssetPath => 'assets/$layoutLocalPath';
  String get thumbAssetPath => 'assets/$thumbLocalPath';
  String get planAssetPath => 'assets/$planPdfLocalPath';

  factory RetailAssets.fromJson(Map<String, dynamic> json) {
    return RetailAssets(
      layoutLocalPath: json['layoutLocalPath'] ?? '',
      layoutRemoteUrl: json['layoutRemoteUrl'] ?? '',
      thumbLocalPath: json['thumbLocalPath'] ?? '',
      thumbRemoteUrl: json['thumbRemoteUrl'] ?? '',
      planPdfLocalPath: json['planPdfLocalPath'] ?? '',
      planPdfRemoteUrl: json['planPdfRemoteUrl'] ?? '',
    );
  }
}
