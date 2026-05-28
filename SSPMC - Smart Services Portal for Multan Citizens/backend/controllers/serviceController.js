import Service from "../models/Services.js";

// Create a new service entry (Hospital, Restaurant, or Park)
export const createService = async (req, res) => {
  try {
    const { name, category, imageUrl, address, latitude, longitude, rating } =
      req.body;

    // Compute folder location directly using the verified incoming category value
    const folderMapping = req.body.category
      ? `${req.body.category.toLowerCase()}s`
      : "general";

    // Extract file path if a file was uploaded via Multer
    const imageUpload = req.file
      ? `/uploads/${folderMapping}/${req.file.filename}`
      : null;

    // Structure location data safely from incoming inputs
    const location = {
      address,
      coordinates: {
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
      },
    };

    const newService = new Service({
      name,
      category,
      imageUrl,
      imageUpload,
      location,
      rating: rating ? Number(rating) : 0,
      createdBy: req.user.id, // Extracted directly from authenticate middleware JWT
    });

    await newService.save();
    res
      .status(201)
      .json({ message: "Service added successfully.", service: newService });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add service.", error: error.message });
  }
};

// Fetch a single service entry by its unique database ID
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id).populate(
      "createdBy",
      "firstname lastname email",
    );

    if (!service) {
      return res.status(404).json({ message: "Service entry not found." });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve service record details.",
      error: error.message,
    });
  }
};

// Fetch all service entries (Publicly accessible)
export const getAllServices = async (req, res) => {
  try {
    const { category } = req.query;

    // Optional filter: allows client to fetch via /api/services?category=park
    const filter = category ? { category: category.toLowerCase() } : {};

    const services = await Service.find(filter).populate(
      "createdBy",
      "firstname lastname email",
    );
    res.status(200).json(services);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch services.", error: error.message });
  }
};

// Updates an existing service listing (Open to all registered community members and admins)
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, imageUrl, address, latitude, longitude, rating } =
      req.body;

    // Fetch the targeted service record
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service entry not found." });
    }

    // Handle conditional image variations safely (Fixed: Swapped undefined for explicit null)
    if (req.file) {
      // Read category dynamically from either the incoming request or the pre-existing record item
      const finalCategory = req.body.category || service.category;
      const folderMapping = finalCategory
        ? `${finalCategory.toLowerCase().trim()}s`
        : "general";

      service.imageUpload = `/uploads/${folderMapping}/${req.file.filename}`;
      service.imageUrl = null;
    } else if (imageUrl && imageUrl.trim() !== "" && imageUrl !== "undefined") {
      service.imageUrl = imageUrl.trim();
      service.imageUpload = null; // Explicitly clear out old file references
    }

    // Process standard fields defensively against text payload anomalies
    if (name && name.trim() !== "" && name !== "undefined") {
      service.name = name.trim();
    }

    if (category && category.trim() !== "" && category !== "undefined") {
      service.category = category.toLowerCase().trim();
    }

    // Handle rating checks safely against string conversions
    if (
      rating !== undefined &&
      rating !== null &&
      rating !== "undefined" &&
      rating !== ""
    ) {
      const parsedRating = Number(rating);
      if (!isNaN(parsedRating)) {
        service.rating = parsedRating;
      }
    }

    // Update the nested location properties safely
    if (address && address.trim() !== "" && address !== "undefined") {
      service.location.address = address.trim();
    }

    if (
      latitude !== undefined &&
      latitude !== null &&
      latitude !== "undefined" &&
      latitude !== ""
    ) {
      const parsedLat = Number(latitude);
      service.location.coordinates.latitude = isNaN(parsedLat)
        ? parseFloat(latitude.toString().replace(/[^\d.-]/g, ""))
        : parsedLat;
    }

    if (
      longitude !== undefined &&
      longitude !== null &&
      longitude !== "undefined" &&
      longitude !== ""
    ) {
      const parsedLng = Number(longitude);
      service.location.coordinates.longitude = isNaN(parsedLng)
        ? parseFloat(longitude.toString().replace(/[^\d.-]/g, ""))
        : parsedLng;
    }

    // Audit Trail: Track the user ID making this modification right now
    service.updatedBy.push({
      userId: req.user.id, // Populated from your token verification middleware pipeline
      updatedAt: new Date(),
    });

    // Save modifications back to MongoDB (This runs validators automatically)
    const savedService = await service.save();

    // Populate user references if you want your frontend panel to display who modified it
    await savedService.populate("updatedBy.userId", "firstname lastname email");

    res.status(200).json({
      message: "Service Profile Updated Successfully!",
      service: savedService,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update service profile.",
      error: error.message,
    });
  }
};

// Delete a service entry (Restricted by route configuration)
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service)
      return res.status(404).json({ message: "Service not found." });

    // Authorization Check: Must be the user who created it OR an admin account
    // Note: Use .toString() because MongoDB ObjectIds are deep objects, not raw strings
    const isCreator = service.createdBy?.toString() === req.user.id.toString();
    const isAdmin = req.user.role === "admin"; // Adjust 'role' key matching your User model

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        message:
          "Access Denied. Only the service creator or district administrators can remove listings.",
      });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Service deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete service.", error: error.message });
  }
};
