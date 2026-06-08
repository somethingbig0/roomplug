export default function About() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50'>
      <section className='w-full max-w-[1200px] mx-auto px-6 lg:px-12 py-20'>
        <div className='bg-white border border-sky-100 rounded-[36px] p-8 lg:p-12 shadow-sm'>
          <div className='max-w-4xl'>
            <p className='w-fit bg-sky-50 border border-sky-100 text-sky-500 rounded-full px-5 py-2 text-sm font-semibold mb-5'>
              About RoomPlug
            </p>

            <h1 className='text-4xl sm:text-5xl font-bold tracking-[-0.05em] text-sky-950 leading-tight'>
              Student accommodation made simpler, safer and more organized.
            </h1>

            <p className='mt-6 text-sky-800/75 leading-8 text-base sm:text-lg'>
              RoomPlug is a student accommodation platform in Zimbabwe built to
              help students find verified rooms without the stress of blindly
              calling random landlords, moving around with no clear information,
              or wasting time on unavailable places.
            </p>

            <p className='mt-5 text-sky-800/75 leading-8 text-base sm:text-lg'>
              Unlike ordinary listing platforms, RoomPlug does not depend on
              landlords to upload rooms by themselves. Our team physically meets
              landlords, checks available rooms, takes room photos, records
              short video tours and uploads the listings ourselves. This helps
              students browse with more confidence before deciding which room
              they want to pursue.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-5 mt-12'>
            <div className='bg-sky-50 border border-sky-100 rounded-3xl p-6'>
              <div className='h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-sky-500 font-bold shadow-sm'>
                1
              </div>
              <h2 className='text-xl font-bold text-sky-950 mt-5'>
                We verify rooms
              </h2>
              <p className='text-sky-700/70 leading-7 mt-3'>
                We visit available rooms, inspect the place, collect photos and
                record short video previews so students can see what they are
                considering.
              </p>
            </div>

            <div className='bg-sky-50 border border-sky-100 rounded-3xl p-6'>
              <div className='h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-sky-500 font-bold shadow-sm'>
                2
              </div>
              <h2 className='text-xl font-bold text-sky-950 mt-5'>
                Students browse freely
              </h2>
              <p className='text-sky-700/70 leading-7 mt-3'>
                Students can view rent, room photos, video previews, location
                area, distance to campus, amenities and rules before choosing a
                room.
              </p>
            </div>

            <div className='bg-sky-50 border border-sky-100 rounded-3xl p-6'>
              <div className='h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-sky-500 font-bold shadow-sm'>
                3
              </div>
              <h2 className='text-xl font-bold text-sky-950 mt-5'>
                We help connect
              </h2>
              <p className='text-sky-700/70 leading-7 mt-3'>
                Once a student chooses a room, RoomPlug helps confirm
                availability and connects them with the landlord through a safer
                access process.
              </p>
            </div>
          </div>

          <div className='mt-12 grid lg:grid-cols-2 gap-6'>
            <div className='bg-white border border-sky-100 rounded-3xl p-6 shadow-sm'>
              <h2 className='text-2xl font-bold text-sky-950'>
                Why RoomPlug exists
              </h2>
              <p className='text-sky-800/75 leading-8 mt-4'>
                Finding accommodation as a student can be frustrating. You may
                hear about a room, travel to see it, discover it is already
                taken, or realize the place is not what you expected. RoomPlug
                is designed to reduce that uncertainty by giving students better
                information before they make a move.
              </p>
            </div>

            <div className='bg-white border border-sky-100 rounded-3xl p-6 shadow-sm'>
              <h2 className='text-2xl font-bold text-sky-950'>
                Why some details are hidden
              </h2>
              <p className='text-sky-800/75 leading-8 mt-4'>
                To protect the process and keep RoomPlug useful, landlord
                contact details and exact addresses are not displayed publicly.
                Students can browse the important room information first, then
                start the access process when they are serious about securing a
                room.
              </p>
            </div>
          </div>

          <div className='mt-12 bg-gradient-to-r from-sky-400 to-cyan-300 rounded-[32px] p-8 lg:p-10 text-white'>
            <h2 className='text-3xl font-bold tracking-[-0.04em]'>
              Built first for students. Designed to grow beyond campus.
            </h2>
            <p className='mt-4 leading-8 max-w-4xl text-white/90'>
              RoomPlug is starting with student accommodation because that is
              where the need is urgent. Over time, the platform can grow into a
              broader accommodation marketplace for rooms, apartments, lodgings
              and short-stay rentals across Zimbabwe.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}