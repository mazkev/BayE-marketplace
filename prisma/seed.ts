import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Seeding database...");

  // Clean old data
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const buyer = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      email: "budi@example.com",
      role: "BUYER",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      addresses: {
        create: {
          label: "Rumah",
          recipient: "Budi Santoso",
          phone: "081234567890",
          city: "Jakarta Selatan",
          fullAddress: "Jl. Sudirman No. 45, Kebayoran Baru, Jakarta Selatan, 12190",
          isDefault: true,
        },
      },
    },
  });

  const seller = await prisma.user.create({
    data: {
      name: "Apex Gear Official Store",
      email: "seller@apexgear.id",
      role: "SELLER",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    },
  });

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Audio & Headphone",
        slug: "audio-headphone",
        icon: "Headphones",
      },
    }),
    prisma.category.create({
      data: {
        name: "Mechanical Keyboard",
        slug: "mechanical-keyboard",
        icon: "Keyboard",
      },
    }),
    prisma.category.create({
      data: {
        name: "Desk Setup & Accessories",
        slug: "desk-setup",
        icon: "Monitor",
      },
    }),
    prisma.category.create({
      data: {
        name: "Smart Gadgets",
        slug: "smart-gadgets",
        icon: "Smartphone",
      },
    }),
  ]);

  const [catAudio, catKeyboard, catDesk, catGadget] = categories;

  // Create Products
  const products = [
    {
      name: "Aura ANC Wireless Studio Headphones",
      slug: "aura-anc-wireless-headphones",
      description: "Headphone wireless kelas audiofil dengan Active Noise Cancellation (ANC) adaptif hingga 42dB, daya tahan baterai 55 jam, dan driver 40mm titanium diaphragm.",
      price: 1850000,
      discount: 15,
      stock: 24,
      featured: true,
      categoryId: catAudio.id,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80",
      ]),
    },
    {
      name: "Keycraft Pro 75% Wireless Mechanical Keyboard",
      slug: "keycraft-pro-75-keyboard",
      description: "Keyboard mekanikal 75% gasket-mounted dengan hot-swappable PCB, south-facing RGB, triple-mode connection (Bluetooth 5.2 / 2.4G / Type-C), dan pre-lubed Gateron Oil King switch.",
      price: 1450000,
      discount: 10,
      stock: 18,
      featured: true,
      categoryId: catKeyboard.id,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80",
      ]),
    },
    {
      name: "Minimalist Solid Oak Monitor Stand Riser",
      slug: "minimalist-solid-oak-monitor-stand",
      description: "Stand monitor kayu oak alami dengan finishing matte anti-gores, laci aluminium tersembunyi, dan slot kabel terintegrasi untuk meja kerja yang rapi dan ergonomis.",
      price: 690000,
      discount: 0,
      stock: 35,
      featured: true,
      categoryId: catDesk.id,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
      ]),
    },
    {
      name: "Lumix Smart RGB Lightbar with Desk Sensor",
      slug: "lumix-smart-rgb-lightbar",
      description: "Screenbar lampu monitor asimetris anti-glare dengan kontrol nirkabel wireless dial, auto-dimming ambient sensor, dan sinkronisasi RGB dinamis.",
      price: 520000,
      discount: 20,
      stock: 40,
      featured: false,
      categoryId: catDesk.id,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&auto=format&fit=crop&q=80",
      ]),
    },
    {
      name: "Nova Hi-Res Spatial Audio Earbuds",
      slug: "nova-hi-res-spatial-earbuds",
      description: "TWS Earbuds dengan sertifikasi Hi-Res LDAC, 6-mic AI noise cancelling untuk panggilan telepon jernih, dan IPX5 water resistance.",
      price: 899000,
      discount: 5,
      stock: 50,
      featured: true,
      categoryId: catAudio.id,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
      ]),
    },
    {
      name: "Precision Ergonomic Vertical Mouse",
      slug: "precision-ergonomic-vertical-mouse",
      description: "Mouse vertikal sudut 57 derajat yang mengurangi ketegangan pergelangan tangan, sensor 4000 DPI ultra-akurat, dan baterai tahan hingga 4 bulan sekali charge.",
      price: 475000,
      discount: 0,
      stock: 25,
      categoryId: catGadget.id,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
      ]),
    },
  ];

  for (const prod of products) {
    const createdProduct = await prisma.product.create({
      data: prod,
    });

    // Add initial review
    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userId: buyer.id,
        rating: 5,
        comment: "Kualitas produk sangat memuaskan, build quality kokoh dan pengiriman sangat cepat!",
      },
    });
  }

  // Create Sample Order
  const firstProduct = await prisma.product.findFirst();
  if (firstProduct) {
    await prisma.order.create({
      data: {
        userId: buyer.id,
        status: "PROCESSING",
        totalAmount: firstProduct.price * 0.85 + 20000,
        shippingFee: 20000,
        paymentMethod: "BCA Virtual Account",
        address: "Jl. Sudirman No. 45, Kebayoran Baru, Jakarta Selatan, 12190",
        items: {
          create: {
            productId: firstProduct.id,
            quantity: 1,
            price: firstProduct.price * 0.85,
          },
        },
      },
    });
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
